# XO.builders Docs

Technical documentation site for the [XO.builders](https://xo.builders) platform. Built with [Fumadocs](https://fumadocs.vercel.app/) + Next.js 15.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Docs Engine:** Fumadocs (MDX-based, auto-generated navigation)
- **Styling:** Tailwind CSS 4 with light/dark theme support
- **Deployment:** Vercel (from GitHub)

## Project Structure

```
app/                  Next.js pages and layouts
app/api/search/       Search API route
content/docs/         MDX documentation files (source of truth)
components/           Custom React components (VideoEmbed, AskXO)
lib/                  Utilities (Fumadocs source loader)
public/               Static assets (images, logos)
```

### Documentation Sections

| Section | Path | Description |
|---------|------|-------------|
| XO Workspaces | `content/docs/xo-workspaces/` | AI agent workspaces (OpenClaw) |
| XO Launchpad | `content/docs/xo-launchpad/` | One-click deployment platform |
| XO MCP Server | `content/docs/xo-mcp-server/` | MCP integration guides |

## Contributing

### Adding a Documentation Page

1. Create an `.mdx` file in the appropriate `content/docs/<section>/` directory:

   ```mdx
   ---
   title: Your Page Title
   description: Outcome-focused one-liner.
   ---

   ## First Section

   Content here.
   ```

2. Add the page slug to the section's `meta.json` `pages` array:

   ```json
   {
     "title": "Section Name",
     "pages": ["existing-page", "your-new-page"]
   }
   ```

3. Run `npm run dev` and visit `/docs/<section>/your-new-page`.

### Adding a New Section

1. Create a directory under `content/docs/`
2. Add a `meta.json` with `title`, `root: true`, and `pages`
3. Create an `index.mdx` landing page
4. Register the section in `content/docs/meta.json`

### Available MDX Components

Fumadocs provides these out of the box:

- **Steps/Step** — Sequential instructions
- **Tabs/Tab** — Tabbed content (e.g., npm vs pnpm)
- **Callout** — Info, warning, and error callouts
- **Accordion/Accordions** — Collapsible content

Custom:

- **VideoEmbed** — Loom video embeds (`import { VideoEmbed } from '@/components/video-embed'`)

### Style Guide

Write like a confident engineer. Be concise and declarative.

- Start sentences with verbs
- Lead headers and descriptions with outcomes, not processes
- No filler words ("simply", "just", "easily")
- No passive voice

See [AGENTS.md](./AGENTS.md) for the full voice & style guide and terminology table.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build (standalone) |
| `npm start` | Start production server |

## Deployment

Deployed on Vercel from GitHub. Pushes to `main` trigger automatic deployments.

## For AI Agents

See [AGENTS.md](./AGENTS.md) for detailed instructions on project structure, conventions, and contribution workflows.
