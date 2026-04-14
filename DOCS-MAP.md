# XO Docs — Page Map & Reusable Components

This file is an index for AI agents and contributors. It describes what each page does, identifies reusable reference pages (pages that other pages link to instead of duplicating content), and provides routing rules for common operations.

## Reusable Reference Pages

These pages are **single sources of truth** for common operations. When any doc needs to describe these actions, link to the relevant page instead of writing inline steps.

| Operation | Page | Anchor | Link Format |
|-----------|------|--------|-------------|
| Open the Configure panel (start machine, view services, open IDE/gateway) | `core-platform-setup/access-restart-machine.mdx` | `#opening-your-ide`, `#opening-the-openclaw-gateway`, `#restarting-the-openclaw-gateway` | `[Configure panel](/docs/xo-workspaces/core-platform-setup/access-restart-machine)` |
| Open a terminal in the workspace | `core-platform-setup/vs-code-server.mdx` | `#open-a-terminal` | `[open a terminal](/docs/xo-workspaces/core-platform-setup/vs-code-server#open-a-terminal)` |
| Restart the OpenClaw gateway (dashboard button + terminal command) | `agents/openclaw/restart-gateway.mdx` | — | `[Restart Gateway guide](/docs/xo-workspaces/agents/openclaw/restart-gateway)` |
| Change the AI model/provider | `agents/openclaw/models/change-model-codex.mdx` | — | `[Change Model guide](/docs/xo-workspaces/agents/openclaw/models/change-model-codex)` |

### Routing Rules

When writing or editing docs that need these operations:

1. **"Open your workspace / IDE"** → Link to Configure panel: `[Configure panel](/docs/xo-workspaces/core-platform-setup/access-restart-machine#opening-your-ide)`
2. **"Open a terminal"** → Link to VS Code Server: `[open a terminal](/docs/xo-workspaces/core-platform-setup/vs-code-server#open-a-terminal)`
3. **"Restart the gateway"** → Link to Restart Gateway: `[restart the gateway](/docs/xo-workspaces/agents/openclaw/restart-gateway)`
4. **"Switch/change model"** → Link to Change Model: `[Change Model guide](/docs/xo-workspaces/agents/openclaw/models/change-model-codex)`

**Standard pattern** for steps that need terminal access:
```
Open your workspace from the [Configure panel](/docs/xo-workspaces/core-platform-setup/access-restart-machine#opening-your-ide), [open a terminal](/docs/xo-workspaces/core-platform-setup/vs-code-server#open-a-terminal), and run:
```

---

## Page Index

### Root
| File | Purpose |
|------|---------|
| `index.mdx` | XO Workspaces landing page — product overview with cards linking to sections |
| `meta.json` | Root nav: index, core-platform-setup, agents, troubleshooting |

### Core Platform Setup (`core-platform-setup/`)
General platform guides — not agent-specific.

| File | Purpose |
|------|---------|
| `index.mdx` | Section landing page |
| `create-account.mdx` | Account creation walkthrough with screenshots |
| `access-restart-machine.mdx` | **REUSABLE** — Configure panel guide: open IDE, monitor resources, service status, open gateway, restart gateway, stop/start machine |
| `vs-code-server.mdx` | **REUSABLE** — Code-Server setup, trust workspace, open terminal |
| `share-project.mdx` | How to share a project with collaborators |

### Agents (`agents/`)
Agent documentation — setup, channels, integrations, skills.

| File | Purpose |
|------|---------|
| `index.mdx` | Agents landing page with cards (OpenClaw, Claude Code, Custom Agent) |
| `openclaw/index.mdx` | OpenClaw overview — links to setup, channels, integrations, models, skills |
| `openclaw/setup.mdx` | OpenClaw setup walkthrough with screenshots (create project, configure, connect gateway, test) |
| `openclaw/restart-gateway.mdx` | **REUSABLE** — Two methods: dashboard button (with screenshots) and terminal command (with logs) |
| `openclaw/channels/connect-slack.mdx` | Slack integration — create app from manifest, install, generate tokens, connect in OpenClaw |
| `openclaw/integrations/manus.mdx` | Manus AI integration |
| `openclaw/integrations/v0-skill.mdx` | V0/Vercel integration |
| `openclaw/models/change-model-codex.mdx` | **REUSABLE** — Switch AI model/provider via `openclaw config` with screenshots |
| `openclaw/skills/backup-restore.mdx` | Backup & restore agent state via GitHub |
| `claude-code/index.mdx` | Placeholder — coming soon |
| `custom-agent/index.mdx` | Placeholder — coming soon |

### Org (`org/`)
| File | Purpose |
|------|---------|
| `index.mdx` | Placeholder — coming soon |

### Troubleshooting (`troubleshooting/`)
Mirrors the agents/org structure. Each agent gets its own troubleshooting page(s).

| File | Purpose |
|------|---------|
| `index.mdx` | Troubleshooting landing page with cards |
| `agents/openclaw/index.mdx` | OpenClaw troubleshooting — accordions for each error (Failed to Create Project, Gateway Token Error, Telegram Not Responding, AI Overloaded, 502 Bad Gateway, Gateway Won't Start, Startup Timeout) |
| `agents/openclaw/claude-usage-limits.mdx` | Fix for "LLM request rejected" error after Anthropic subscription changes |
| `agents/claude-code.mdx` | Placeholder — coming soon |
| `agents/custom-agent.mdx` | Placeholder — coming soon |
| `org/index.mdx` | Placeholder — coming soon |

---

## Image Naming Conventions

Images are in `public/images/`. Prefixes indicate which section they belong to:

| Prefix | Section |
|--------|---------|
| `cfg-` | Configure panel / access-restart-machine |
| `ts-` | Troubleshooting |
| `restart-` | Restart gateway |
| `model-` | Change model |
| `openclaw-setup-*` | OpenClaw setup |
| `openclaw-click-*` | OpenClaw gateway connection |
| `codex-` | Codex model setup |
| `core-platform-setup/` | Core platform setup subfolder |

---

## Cross-Linking Patterns

When pages reference each other, follow these patterns:

- **Troubleshooting pages** link back to the relevant setup/guide page for "how to do X"
- **Setup pages** link forward to troubleshooting for "if something goes wrong"
- **All pages** that need terminal access use the standard Configure panel + VS Code Server pattern above
- **Never duplicate** the Configure panel, terminal opening, or restart gateway steps inline — always link to the reference page
