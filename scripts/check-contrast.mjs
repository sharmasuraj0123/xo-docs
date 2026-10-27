#!/usr/bin/env node
// Checks that every text/surface token pair in src/app/global.css meets
// WCAG 2.1 AA, in light, dark and the sidebar's layer stack. Text needs 4.5:1; focus rings need 3:1
// (non-text contrast). Run: npm run check:contrast
import { readFileSync } from "node:fs";

const css = readFileSync(
  new URL("../src/app/global.css", import.meta.url),
  "utf8",
);

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`No "${selector} {" block in global.css`);
  const body = css.slice(start, css.indexOf("}", start));
  const tokens = {};
  for (const [, name, hex] of body.matchAll(
    /--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g,
  )) {
    tokens[name] = hex;
  }
  return tokens;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const surfaces = [
  "fd-background",
  "fd-card",
  "fd-popover",
  "fd-muted",
  "fd-secondary",
  "fd-accent",
  // Canopy's front capsule (the article) and the cards raised inside it.
  "front",
  "front-raised",
];
const pairs = [
  // Text colours on every surface they can sit on.
  ...["fd-foreground", "fd-muted-foreground", "fd-primary"].flatMap((fg) =>
    surfaces.map((bg) => [fg, bg, 4.5]),
  ),
  ["fd-card-foreground", "fd-card", 4.5],
  ["fd-popover-foreground", "fd-popover", 4.5],
  ["fd-secondary-foreground", "fd-secondary", 4.5],
  ["fd-accent-foreground", "fd-accent", 4.5],
  ["fd-primary-foreground", "fd-primary", 4.5],
  // Focus ring against the page.
  ["fd-ring", "fd-background", 3],
];

let failed = 0;
// The sidebar's layer stack holds no front capsule, so it skips those.
const frontOnly = ["front", "front-raised"];
for (const [mode, tokens, skip = []] of [
  ["light", block("@theme")],
  ["dark", block(".dark")],
  ["stack", block(":is(#nd-sidebar, #nd-sidebar-mobile)"), frontOnly],
]) {
  for (const [fg, bg, min] of pairs) {
    if (skip.includes(bg)) continue;
    if (!tokens[fg] || !tokens[bg]) {
      console.error(`✗ ${mode}: missing --color-${!tokens[fg] ? fg : bg}`);
      failed++;
      continue;
    }
    const r = ratio(tokens[fg], tokens[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `${ok ? "✓" : "✗"} ${mode.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)}:1 (min ${min})`,
    );
  }
}

if (failed) {
  console.error(`\n${failed} pair(s) below WCAG 2.1 AA.`);
  process.exit(1);
}
console.log("\nAll token pairs meet WCAG 2.1 AA.");
