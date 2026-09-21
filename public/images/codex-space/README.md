# Codex / XO Space installation guide screenshots

These images support `/docs/space/install-space-in-codex`.

| File | Source and purpose |
|---|---|
| `plugin-marketplace-reference.png` | Unmodified reference image from OpenAI's [Package your plugin](https://developers.openai.com/plugins/build/plugins) guide. [Original PNG](https://developers.openai.com/images/codex/plugins/codex-local-plugin-light.png), retrieved 2026-09-21. It illustrates the marketplace selector and install control using an example plugin; it is **not** an XO Space listing or a capture of this user's app. The article caption attributes the image to OpenAI. |
| `space-projects.png` | Actual XO Space Projects → Overview in Codex's in-app browser, captured 2026-09-21. An isolated empty workspace is online; no personal project data appears. |
| `space-setup-workspace.png` | Actual Space Setup → Workspace, scrolled to Folders, from the same demo. Paths under `/private/tmp/xo-codex-guide-demo/` are demonstration paths, not plugin defaults. |
| `space-setup-intelligence.png` | Actual Space Setup → Intelligence layer, showing Codex selected and in use, from the same demo. |

Space capture source: `quirq-ai/xo-space` commit `7949065`, the implementation
proposed in [PR #166](https://github.com/quirq-ai/xo-space/pull/166). The demo ran
on loopback with isolated home, configuration, project and state directories.
No account credentials or personal files were used. Activity collection was
disabled for the demo; a fresh plugin installation normally uses the server's
activity defaults. The screenshots are unretouched browser captures.

The Codex native app window is unavailable to automated capture in this
environment. Consequently the plugin-browser figure is explicitly labeled as an
official reference image, not as evidence of clicking Install for XO Space.
Installation through the real Codex CLI, cached bundle execution, server health,
UI response and restart were verified for the implementation PR.

To refresh: run a disposable local Space with the Codex backend, open `/space/`
in Codex's browser, and capture the three routes above without personal data.
Update captions and this source record when the UI or release changes.
