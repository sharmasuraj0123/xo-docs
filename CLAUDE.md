# Claude Code Instructions — XO.builders Docs

When the user uploads a video demo, screen recording, or walkthrough and asks to generate documentation from it, follow this workflow to produce a production-ready `.mdx` file styled for the **XO.builders** Fumadocs site.

Trigger phrases: "create docs from this video", "document this feature", "turn this demo into docs", "generate an MDX file from my recording", "write docs based on what I showed".

---

## Workflow

### Step 1 — Analyze the Video

Use vision capabilities to analyze the video frame by frame. Extract:

- What product/feature/tool is being demonstrated
- The main steps or actions being performed
- Any UI elements, code snippets, commands, or config shown
- The apparent goal or outcome of the demo
- Any error states, edge cases, or tips shown

If the video can't be processed directly, ask the user for a description or key screenshots.

### Step 2 — Clarify (if needed)

Ask at most ONE question if something critical is ambiguous — e.g. the page title or doc type (quickstart vs. how-to vs. reference). Make reasonable assumptions for everything else and note them.

### Step 3 — Generate the MDX File

Produce a complete `.mdx` file following the Fumadocs format and XO.builders style rules below.

**Filename convention:** lowercase, hyphen-separated. e.g. `deploy-agent.mdx`, `connect-telegram.mdx`, `configure-api-keys.mdx`

### Step 4 — Deliver

Save to the project's `content/docs/` folder (or output it directly). Briefly summarise what was documented and any assumptions made.

---

## Fumadocs MDX Format

### Frontmatter

```mdx
---
title: Your Page Title
description: One punchy line describing the outcome.
---
```

Optional fields: `icon` (Lucide icon name), `full: true` (full-width layout).

### Headings

- `##` for top-level sections — never `#` (the title handles h1)
- `###` for subsections
- `####` sparingly

### Steps Component

```mdx
import { Step, Steps } from 'fumadocs-ui/components/steps';

<Steps>
  <Step>
    ### Do the Thing
    Run the command.
    ```bash
    npm run deploy
    ```
  </Step>
  <Step>
    ### Next Thing
    Description here.
  </Step>
</Steps>
```

### Tabs Component

```mdx
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

<Tabs items={['npm', 'pnpm', 'yarn']}>
  <Tab value="npm">
    ```bash
    npm install fumadocs-core
    ```
  </Tab>
  <Tab value="pnpm">
    ```bash
    pnpm add fumadocs-core
    ```
  </Tab>
</Tabs>
```

### Callouts

```mdx
import { Callout } from 'fumadocs-ui/components/callout';

<Callout type="info">One or two sentences max.</Callout>
<Callout type="warn">Be careful about this.</Callout>
<Callout type="error">This will break things.</Callout>
```

### Code Blocks

Always include the language tag. Use `bash` for terminal, `env`/`json`/`yaml` for config.

````mdx
```bash
npm run dev
```
````

### Accordions

```mdx
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

<Accordions>
  <Accordion title="Question here?">
    Answer here.
  </Accordion>
</Accordions>
```

### Images

```mdx
![Alt text describing the screenshot](/images/my-screenshot.png)
```

Place images in the `public/images/` folder. If writing from a video, note where screenshots should be added manually.

### Internal Links

```mdx
[See configuration](/docs/configuration)
```

---

## XO.builders Voice & Style

### Brand Identity

XO.builders is a technical startup platform for deploying AI agents in one click. The brand feels like a **confident, opinionated engineer** wrote it — not a marketing team. Core values: speed, simplicity, security, power.

### DO

- Start sentences with verbs: "Deploy your agent." not "You can deploy your agent."
- Be concise — eliminate every word that doesn't earn its place
- Use confident, declarative statements: "Your agent is live." not "Your agent should now be live."
- Call out security as a feature, not a footnote: "API keys are encrypted. Nothing leaves your container."
- Use short punchy sentences for key points: "Zero DevOps. Zero Downtime. Just deploy."
- Trust the reader — don't over-explain what an API key is

### DON'T

- No filler: "simply", "just", "easily", "of course", "please note that"
- No passive voice: "the agent will be deployed" → "your agent deploys"
- No padding — one sentence steps get one sentence
- No corporate speak: "leverage", "utilize", "facilitate"

### Descriptions (frontmatter)

Lead with the outcome, not the process.

```
✅ Deploy OpenClaw securely in under 60 seconds.
✅ Connect your agent to Telegram, Slack, Discord, and more.
❌ This page explains how to deploy your agent using the XO platform.
```

### Headers

Outcome-first, not topic-first.

```
✅ ## Go Live in 60 Seconds
✅ ## Add Your API Keys
❌ ## Overview of the Deployment Process
```

### Page Structure

**Quickstart / Getting Started** — always follow XO's 3-step pattern:
1. Sign Up / Create account
2. Configure (add keys, set options)
3. Go live / Access dashboard

**How-To / Feature pages:**
1. One-line overview
2. Prerequisites (short bullet list)
3. Steps via `<Steps>` component
4. Troubleshooting section (optional)

**Reference pages:** use a table with columns `Field`, `Required`, `Description`, `Default`.

### Terminology

| Use | Not |
|---|---|
| Workspace | Project / Environment |
| Agent | Bot / Assistant |
| Clawdbot | ClawdBot / clawdbot |
| OpenClaw | Open Claw / openclaw |
| Dashboard | Admin panel / Console |
| Deploy | Launch / Publish / Start |
| Channel | Platform / Integration |
| API Key | Token (unless it's specifically a token) |

---

## XO Theme Config (Fumadocs)

Add to `app/global.css` for exact brand alignment:

```css
/* XO.builders dark palette */
:root {
  --background: #000000;
  --foreground: #ffffff;
  --muted: #111111;
  --accent: #22c55e; /* XO green */
  --border: #1f1f1f;
}
```

---

## Complete Example

```mdx
---
title: Connect to Telegram
description: Get your agent live on Telegram in under 2 minutes.
---

import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Callout } from 'fumadocs-ui/components/callout';

## What You'll Need

- A Telegram account
- Your bot token from [@BotFather](https://t.me/botfather)
- An active XO workspace

## Connect Your Agent

<Steps>
  <Step>
    ### Get Your Bot Token
    Message [@BotFather](https://t.me/botfather) on Telegram. Run `/newbot`, follow the prompts, and copy the token.
  </Step>
  <Step>
    ### Add the Token to XO
    Open your workspace in the XO dashboard and paste the token into the **Telegram Bot Token** field.

    <Callout type="info">
      Your token is encrypted immediately. XO never stores it in plaintext.
    </Callout>
  </Step>
  <Step>
    ### Deploy
    Click **Create Project**. Your agent goes live on Telegram in under 60 seconds.
  </Step>
</Steps>

## Your Agent is Live

Message your bot. It responds in under 2 seconds.

## Troubleshooting

### Bot isn't responding
Check your token format — it should start with a number and colon (e.g. `7312...:AAH...`). Re-paste it in the dashboard and redeploy.
```