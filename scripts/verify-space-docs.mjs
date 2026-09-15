import assert from "node:assert/strict";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = process.env.DOCS_PREVIEW_URL || "http://127.0.0.1:3101";
const output = resolve(process.argv[2] || "/tmp/xo-space-docs-review");
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(
  modulePath ? pathToFileURL(modulePath).href : "playwright"
);
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const routes = [];
async function collect(directory, prefix) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory())
      await collect(resolve(directory, entry.name), `${prefix}/${entry.name}`);
    else if (entry.name.endsWith(".mdx"))
      routes.push(
        entry.name === "index.mdx"
          ? prefix
          : `${prefix}/${entry.name.slice(0, -4)}`,
      );
  }
}
await collect(resolve(root, "content/docs/space"), "/docs/space");
await mkdir(output, { recursive: true });
const report = { routes: [], links: [], errors };
const links = new Set();
try {
  for (const route of routes.sort()) {
    const response = await page.goto(`${origin}${route}`, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route);
    const title = await page.locator("h1").first().innerText();
    assert.ok(title.trim(), `${route}: missing title`);
    const content = page.locator("#nd-page");
    assert.equal(await content.count(), 1, `${route}: missing article`);
    for (const image of await content.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((img) => img.decode());
      assert.ok(
        await image.getAttribute("alt"),
        `${route}: image needs alt text`,
      );
    }
    const found = await content
      .locator("a[href]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    for (const href of found) {
      if (href.startsWith("/") && !href.startsWith("//")) links.add(href);
      else if (href.startsWith("#")) links.add(route + href);
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${route}: horizontal overflow`,
    );
    report.routes.push({
      route,
      title,
      images: await content.locator("img").count(),
    });
    console.log(`Verified ${route}`);
  }
  for (const href of [...links].sort()) {
    const url = new URL(href, origin);
    const response = await context.request.get(url.href);
    assert.equal(response.status(), 200, href);
    if (url.hash) {
      const html = await response.text();
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(html.includes(`id="${id}"`), `${href}: missing anchor`);
    }
    report.links.push(href);
  }
  for (const [width, name] of [
    [1440, "desktop"],
    [390, "mobile"],
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [route, slug] of [
      ["/docs/space/space-walk", "overview"],
      ["/docs/space/space-walk/manage", "manage"],
      ["/docs/space/space-walk/sessions", "agents"],
      ["/docs/space/space-walk/setup", "setup"],
      ["/docs/space/space-walk/commands", "commands"],
      ["/docs/space/space-walk/inbox", "inbox"],
      ["/docs/space/space-walk/wiki", "wiki"],
      ["/docs/space/space-walk/connectors", "connectors"],
      ["/docs/space/observability", "observability"],
      ["/docs/space/observability/storage", "storage"],
      ["/docs/space/observability/collection", "collection"],
      ["/docs/space/install-space-as-a-skill/codex", "codex"],
    ]) {
      await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width}px ${route}: horizontal overflow`,
      );
      await page.screenshot({ path: resolve(output, `${slug}-${name}.png`) });
      for (const [index, figure] of (
        await page.locator("#nd-page figure").all()
      ).entries()) {
        assert.ok(
          await figure.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return bounds.left >= 0 && bounds.right <= innerWidth;
          }),
          `${width}px ${route}: figure extends outside viewport`,
        );
        await figure.screenshot({
          path: resolve(output, `${slug}-figure-${index + 1}-${name}.png`),
          // Isolate the diagram; full-page captures above retain the site chrome.
          style: ".fixed, .sticky, nextjs-portal { visibility: hidden; }",
        });
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    `${report.routes.length} Space pages and ${report.links.length} links passed; desktop/mobile screenshots in ${output}`,
  );
} finally {
  await writeFile(
    resolve(output, "report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();
}
