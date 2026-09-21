# Codex / XO Space installation guide screenshots

These images support `/docs/space/install-space-in-codex`.

| File | Source and purpose |
|---|---|
| `space-projects.png` | Actual XO Space Projects → Overview in Codex's in-app browser, captured 2026-09-21. An isolated empty workspace is online; no personal project data appears. |
| `space-setup-workspace.png` | Actual Space Setup → Workspace, scrolled to Folders, from the same demo. Paths under `/private/tmp/xo-codex-guide-demo/` are demonstration paths, not plugin defaults. |
| `space-setup-intelligence.png` | Actual Space Setup → Intelligence layer, showing Codex selected and in use, from the same demo. |

Space capture source: `quirq-ai/xo-space` commit `7949065`. The demo ran
on loopback with isolated home, configuration, project and state directories.
No account credentials or personal files were used. Activity collection was
disabled for the demo; a fresh plugin installation normally uses the server's
activity defaults. The screenshots are unretouched browser captures.

The Codex native app window is unavailable to automated capture in this
environment. The guide links to [OpenAI's plugin guide](https://developers.openai.com/plugins/build/plugins#build-your-own-curated-plugin-list)
for a marketplace UI example instead of redistributing its image.
Installation through the real Codex CLI, cached bundle execution, server health,
UI response and restart were verified during plugin development.

To refresh: run a disposable local Space with the Codex backend, open `/space/`
in Codex's browser, and capture the three routes above without personal data.
Update captions and this source record when the UI or release changes.
