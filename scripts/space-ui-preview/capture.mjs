#!/usr/bin/env node
/* Unmodified browser captures of a sibling xo-space checkout. All API data
   comes from server.py, with no live accounts or private workspace reads. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href
    : "playwright"
);
const origin = process.env.SPACE_PREVIEW_URL || "http://127.0.0.1:5101";
const output = resolve(
  process.argv[2] || resolve(here, "../../public/images/space"),
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  locale: "en-US",
  timezoneId: "UTC",
  reducedMotion: "no-preference",
});
await context.addInitScript(() => {
  const NativeDate = Date;
  const now = NativeDate.parse("2026-09-14T10:00:00Z");
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() {
      return now;
    }
  };
  let seed = 100;
  Math.random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("response", (response) => {
  if (response.status() >= 400)
    errors.push(`${response.status()} ${response.url()}`);
});
const metadata = await (
  await context.request.get(`${origin}/__fixture__/meta`)
).json();
assert.equal(
  metadata.assets_modified,
  false,
  "Source UI must be an unmodified checkout",
);
const report = {
  source: metadata,
  viewport: { width: 1440, height: 1000 },
  screenshots: [],
  checks: [],
  errors,
};

async function go(id) {
  await page.goto(`${origin}/space/#/${id}`, { waitUntil: "networkidle" });
  await page.waitForFunction((id) => location.hash === `#/${id}`, id);
}
async function settleGraph() {
  await page.waitForFunction(() =>
    document.querySelector("#q")?.placeholder.match(/Search \d+/),
  );
  await page.waitForFunction(
    () => document.querySelector("#simstat")?.style.opacity === "0",
    undefined,
    { timeout: 20000 },
  );
}
async function shot(name, description) {
  // Let native page crossfades and drawer transitions finish before capture.
  await page.waitForTimeout(750);
  await page.mouse.move(1430, 985);
  await page.screenshot({
    path: resolve(output, `${name}.png`),
  });
  const bytes = await readFile(resolve(output, `${name}.png`));
  report.screenshots.push({
    file: `${name}.png`,
    description,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
  console.log(`Captured ${name}.png`);
}

try {
  await go("dashboard");
  await settleGraph();
  assert.deepEqual(
    await page
      .locator(".tabs button")
      .evaluateAll((buttons) => buttons.map((b) => b.id)),
    [
      "tab-projects",
      "tab-time",
      "tab-sessions",
      "tab-inbox",
      "tab-wiki",
      "tab-secrets",
      "tab-connectors",
    ],
  );
  await shot(
    "dashboard",
    "Default Dashboard lens: ten projects grouped into five environments.",
  );
  await page.locator("#q").fill("Aurora Console");
  await page.locator("#q").press("Enter");
  await page
    .locator('#panel[data-id="aurora-console"] .ptodo')
    .first()
    .waitFor();
  await page.waitForFunction(
    () => !document.querySelector("#toast")?.classList.contains("is-on"),
  );
  await settleGraph();
  await page.waitForTimeout(1300);
  assert.equal(
    await page.locator('#panel[data-id="aurora-console"].is-open').count(),
    1,
  );
  assert.ok(
    (await page.locator('#panel[data-id="aurora-console"] .ptodo').count()) >=
      3,
  );
  await shot(
    "dashboard-detail",
    "Selected Dashboard project with live todo satellites and the detail panel.",
  );

  await page.locator("#panel-close").click();
  await go("projects");
  await page.locator(".prj-row").first().waitFor();
  assert.equal(await page.locator(".prj-row").count(), 10);
  await shot(
    "projects-list",
    "Projects List with descriptions, live activity and file counts.",
  );
  await page.locator('[data-id="aurora-console"].prj-row-head').click();
  await page.locator('[data-file="README.md"]').waitFor();
  await shot(
    "projects-detail",
    "Expanded project drawer: files, todos, open sessions and recent events.",
  );
  await page.locator('[data-file="README.md"]').click();
  await page.locator("#preview-body .pv-md").waitFor();
  await page
    .locator('#preview-version option[value="0"]')
    .waitFor({ state: "attached" });
  await shot(
    "file-preview",
    "Rendered file preview with source toggle and version history picker.",
  );
  await page.locator("#preview-version").selectOption("0");
  await page.waitForFunction(() =>
    document
      .querySelector("#preview-body")
      ?.textContent.includes("An earlier version"),
  );
  await shot(
    "file-version",
    "A historical version rendered in the same file preview.",
  );
  await page.locator("#preview-close").click();

  await go("graph");
  await settleGraph();
  await shot("graph", "File graph across all ten fictional projects.");
  await go("tree");
  await page.locator('.tv-node[title="Aurora Console"]').click();
  await page.locator('.tv-node[title="src"]').click();
  await page.locator(".tv-leaf").first().waitFor();
  await page.locator('[data-tv="reset"]').click();
  await page.waitForTimeout(650);
  await shot(
    "tree",
    "Tree lens: an expanded project and source folder in the workspace directory hierarchy.",
  );
  await go("sharing");
  await page.locator(".shl-detail").waitFor();
  await page.locator(".shr-members .shr-row").first().waitFor();
  await shot(
    "sharing",
    "Sharing lens with fetched commits awaiting explicit application.",
  );

  await go("time");
  await page.locator("#tmode").waitFor({ state: "visible" });
  await page.locator('[data-tmode="project"]').click();
  await shot(
    "timeline",
    "Timeline in By project mode, showing parallel project histories.",
  );
  await page.locator('[data-tmode="file"]').click();
  await shot(
    "timeline-files",
    "Timeline in By file mode, showing when artifacts first appeared.",
  );

  await go("sessions");
  await page.locator("#ch-area canvas").waitFor();
  await shot(
    "sessions",
    "Sessions overview: token trends, source filters, costs and model usage.",
  );
  for (const [id, description] of [
    ["tools", "Session tools: call counts, errors and the tool leaderboard."],
    ["models", "Session models: token share and costs where available."],
    ["trends", "Session trends: weekly usage and top model by week."],
  ]) {
    await page.locator(`[data-sub="${id}"]`).click();
    await page.locator("#sess-body .stbl").first().waitFor();
    await shot(`sessions-${id}`, description);
  }
  await page.locator('[data-sub="sessions"]').click();
  await page.locator("[data-sid]").first().waitFor();
  await shot(
    "sessions-list",
    "Session table with sorting, pagination and telemetry by source.",
  );
  await page.locator("[data-sid]").first().click();
  await page.locator(".sess-prompt").first().waitFor();
  await shot(
    "session-detail",
    "Session detail: tokens, duration, source and tools.",
  );
  await page.mouse.move(1100, 700);
  await page.mouse.wheel(0, 650);
  await page.waitForTimeout(200);
  await shot(
    "session-prompts",
    "Session detail showing fictional prompts grouped by turn.",
  );

  await go("inbox");
  await page.locator(".inb-row").first().waitFor();
  await page.locator('[data-act="conns-toggle"]').click();
  await page.locator('[data-act="toggle"][data-id="00000004"]').click();
  await shot(
    "inbox",
    "Inbox with expanded connections, account labels, and an item already marked seen.",
  );
  await go("wiki");
  await page.locator(".wiki-article").waitFor();
  await shot(
    "wiki",
    "Bundled Wiki with the version-matched storage and data map.",
  );

  await go("secrets");
  await page.locator("#setup-alert.is-good").waitFor();
  await page.locator(".source-row").first().waitFor();
  await shot(
    "setup",
    "Runtime Setup: storage roots, active backend and watched native session stores.",
  );
  await page.mouse.move(1100, 700);
  await page.mouse.wheel(0, 650);
  await page.waitForTimeout(200);
  await shot(
    "setup-runtime",
    "Runtime settings and native source coverage; no secret values exist in the fixtures.",
  );
  await go("quirq");
  await page.locator("#quirq-activity-badge.is-live").waitFor();
  await shot(
    "quirq",
    "Machine-local Quirq state reached from Setup, including storage ownership and watcher heartbeat.",
  );

  await go("connectors");
  await page.locator(".conn-card").first().waitFor();
  assert.equal(await page.locator(".conn-card").count(), 10);
  await shot(
    "connectors",
    "Connected apps showing account labels, workspace scope and available actions.",
  );
  await page.locator('[data-toolkit="gmail"] [data-action="polling"]').click();
  await page.locator('#poll-gmail [data-poll="enabled"]').waitFor();
  await shot(
    "connector-polling",
    "Gmail polling drawer with collector selection, cadence and account label.",
  );

  await page.locator('[data-toolkit="gmail"] [data-action="polling"]').click();
  await page.locator('[data-toolkit="gmail"] [data-action="actions"]').click();
  await page.locator(".conn-actions .conn-action").first().waitFor();
  assert.equal(await page.locator(".conn-actions .conn-action").count(), 5);
  await shot(
    "connector-actions",
    "Gmail action preferences with read/write categories and a disabled send action.",
  );

  assert.deepEqual(
    errors,
    [],
    "No console, page or HTTP errors while rendering documented states",
  );
  report.checks.push(
    "Every capture rendered using original source assets, with no source modifications or DOM/CSS substitutions.",
  );
  report.checks.push(
    "All data is synthetic; no xo-space runtime, upstream request, account write, credential or private workspace is used.",
  );
  report.checks.push(
    "Seven tabs, ten projects, ten connectors, historical file preview, session table/detail, and polling drawer verified.",
  );
  console.log(
    `Captured ${report.screenshots.length} screenshots without browser errors.`,
  );
} catch (error) {
  report.failure = error.stack;
  await page
    .screenshot({ path: "/tmp/space-docs-capture-failure.png" })
    .catch(() => {});
  throw error;
} finally {
  await writeFile(
    resolve(here, "capture-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();
}
