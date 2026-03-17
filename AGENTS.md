# AGENTS.md — XO.builders Docs

Instructions for AI agents (Claude Code, Copilot, Cursor, etc.) contributing to this repository.

## Project Overview

This is the **XO.builders documentation site** — a Fumadocs-powered Next.js 15 app serving technical docs for the XO platform. Dark-themed, MDX-driven, deployed via Docker to `registry.xo.builders`.

**Stack:** Next.js 15, React 19, Fumadocs (core + mdx + ui), Tailwind CSS 4, TypeScript

## Repository Structure

```
xo-docs/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (dark theme, Geist font)
│   ├── page.tsx                # Landing page with product grid
│   ├── global.css              # XO brand theme (CSS variables)
│   └── docs/
│       ├── layout.tsx          # Docs layout (DocsLayout, nav, sidebar)
│       └── [[...slug]]/page.tsx # Dynamic doc page renderer
├── components/
│   └── video-embed.tsx         # Client component for Loom video embeds
├── content/docs/               # ALL documentation lives here (MDX)
│   ├── meta.json               # Root navigation order
│   ├── index.mdx               # Docs landing page
│   ├── xo-vibe/                # XO Vibe product docs
│   ├── xo-launchpad/           # XO Launchpad product docs
│   ├── xo-mcp-server/          # XO MCP Server docs
│   ├── xo-workspaces/          # XO Workspaces docs
│   └── xo-support-hub.mdx     # Support page
├── lib/
│   └── source.ts               # Fumadocs source loader + icon resolution
├── public/                     # Static assets (images, logos)
├── source.config.ts            # Fumadocs MDX configuration
├── next.config.mjs             # Next.js config (standalone output)
├── Dockerfile                  # Multi-stage production build
└── .github/workflows/deploy.yml # CI/CD to registry.xo.builders
```

## Commands

```bash
npm install          # Install deps (runs fumadocs-mdx postinstall)
npm run dev          # Dev server with Turbopack
npm run build        # Production build (standalone)
npm start            # Start production server
```

## How Documentation Works

### Content Pipeline

1. MDX files in `content/docs/` are the source of truth
2. `source.config.ts` tells fumadocs-mdx to scan `content/docs/`
3. `npm run postinstall` (or `npx fumadocs-mdx`) generates `.source/` directory (gitignored)
4. `lib/source.ts` loads the generated source and resolves Lucide icons from metadata
5. `app/docs/[[...slug]]/page.tsx` renders each page using fumadocs-ui components

### Navigation

Navigation is controlled by `meta.json` files at each directory level:

```json
{
  "title": "Section Title",
  "root": true,
  "icon": "LucideIconName",
  "pages": ["page-slug-1", "page-slug-2", "subfolder"]
}
```

- Root `content/docs/meta.json` defines top-level sections
- Each section folder has its own `meta.json` for page ordering
- Pages not listed in `meta.json` won't appear in navigation

### Adding a New Page

1. Create `content/docs/<section>/my-page.mdx` with frontmatter:
   ```mdx
   ---
   title: Page Title
   description: Outcome-focused one-liner.
   ---
   ```
2. Add `"my-page"` to the section's `meta.json` `pages` array
3. The page is live at `/docs/<section>/my-page`

### Adding a New Section

1. Create `content/docs/<section-name>/` directory
2. Add `meta.json` with `title`, `root: true`, and `pages` array
3. Create an `index.mdx` for the section landing page
4. Add `"<section-name>"` to root `content/docs/meta.json` `pages` array

## MDX Authoring Rules

### Frontmatter

```mdx
---
title: Your Page Title
description: One punchy line describing the outcome.
---
```

Optional: `icon` (Lucide icon name), `full: true` (full-width layout).

### Available Components

Import from fumadocs-ui. These are the components used across the site:

```mdx
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
```

Custom component:
```mdx
import { VideoEmbed } from '@/components/video-embed';
<VideoEmbed id="loom-video-id" title="Optional title" />
```

### Headings

- `##` for top-level sections (never `#` — title handles h1)
- `###` for subsections
- `####` sparingly

### Code Blocks

Always include the language tag: `bash`, `typescript`, `json`, `yaml`, `env`, etc.

### Images

Place in `public/images/`, reference as `![Alt text](/images/filename.png)`.

### Internal Links

```mdx
[Link text](/docs/section/page)
```

## XO.builders Voice & Style

Write like a **confident, opinionated engineer** — not a marketing team.

### Rules

- Start sentences with verbs: "Deploy your agent." not "You can deploy your agent."
- Be concise — cut every word that doesn't earn its place
- Use declarative statements: "Your agent is live." not "Your agent should now be live."
- No filler words: "simply", "just", "easily", "of course", "please note that"
- No passive voice: "the agent will be deployed" -> "your agent deploys"
- No corporate speak: "leverage", "utilize", "facilitate"

### Frontmatter Descriptions

Lead with outcome, not process:
- Good: "Deploy OpenClaw securely in under 60 seconds."
- Bad: "This page explains how to deploy your agent using the XO platform."

### Section Headers

Outcome-first:
- Good: "Go Live in 60 Seconds"
- Bad: "Overview of the Deployment Process"

### Terminology

| Use | Not |
|-----|-----|
| Workspace | Project / Environment |
| Agent | Bot / Assistant |
| Dashboard | Admin panel / Console |
| Deploy | Launch / Publish / Start |
| Channel | Platform / Integration |
| API Key | Token (unless specifically a token) |
| Clawdbot | ClawdBot / clawdbot |
| OpenClaw | Open Claw / openclaw |

### Page Templates

**Quickstart pages** follow a 3-step pattern:
1. Sign Up / Create account
2. Configure (add keys, set options)
3. Go live / Access dashboard

**How-To pages:**
1. One-line overview
2. Prerequisites (short bullet list)
3. Steps via `<Steps>` component
4. Troubleshooting section (optional)

**Reference pages:** table with columns `Field`, `Required`, `Description`, `Default`.

## Video-to-Docs Workflow

When generating documentation from a video demo or screen recording:

1. **Analyze** — Extract the feature, steps, UI elements, commands, and outcome
2. **Clarify** — Ask at most ONE question if something critical is ambiguous
3. **Generate** — Produce a complete `.mdx` file following the format above
4. **Deliver** — Save to `content/docs/` and summarize assumptions

**Filename convention:** lowercase, hyphen-separated (e.g., `deploy-agent.mdx`, `connect-telegram.mdx`)

## Theme Reference

XO dark palette (defined in `app/global.css`):

| Variable | Value | Usage |
|----------|-------|-------|
| Background | `#09090b` | Page background |
| Foreground | `#fafafa` | Text |
| Primary/Accent | `#83d63a` | XO green, links, highlights |
| Card | `#111113` | Card backgrounds |
| Border | `#27272a` | Borders, dividers |
| Muted | `#18181b` | Muted backgrounds |

Dark theme is forced — no light mode toggle (`defaultTheme: 'dark'`, `enableSystem: false`).

## Deployment

- **Docker:** Multi-stage build (deps -> builder -> runner) on Node 20 Alpine
- **Registry:** `registry.xo.builders`
- **CI/CD:** GitHub Actions on push to `main`
- **Port:** 3000
- **Build note:** `fumadocs-mdx` runs in the builder stage (not postinstall) to generate `.source/`

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/docs/[[...slug]]/page.tsx` | Renders every doc page |
| `app/docs/layout.tsx` | Docs layout, nav, sidebar config |
| `app/page.tsx` | Landing page with product cards |
| `app/global.css` | All theme/brand CSS variables |
| `lib/source.ts` | Fumadocs source loader + icon mapping |
| `source.config.ts` | Fumadocs MDX content directory config |
| `content/docs/meta.json` | Root navigation structure |
| `components/video-embed.tsx` | Loom video embed component |
