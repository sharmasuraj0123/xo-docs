# Space documentation screenshots

These images capture the actual, unmodified `space_ui` browser application from
[xo-space](https://github.com/quirq-ai/xo-space), with a fictional workspace supplied
by a local Python fixture server. They are browser captures, not visual mockups.

The checked-in images follow source revision
`4b1a58068a6adba4a44cce69c23195f3fe4b53eb`, including the four primary tabs,
Projects Overview/Data/Timeline/Manage, Agents Overview/Sessions/Trends/Configure,
Inbox subpages, the sectioned Setup page and command palette.
`capture-report.json` records the source revision, every served UI asset hash
(excluding Finder metadata), screenshot descriptions, PNG hashes and byte sizes,
and browser validation results. It contains no local checkout paths.

## Reproduce

Requirements: Python 3.9+, Node.js 18+, Git, Playwright and its Chromium browser.
Check out the source revision above in a sibling `xo-space` directory. The capture
script rejects a checkout with modified `space_ui` files.

From the `xo-docs` repository, start the fixture server on an unused local port:

```sh
python3 scripts/space-ui-preview/server.py --source ../xo-space --port 5127
```

In another terminal, run:

```sh
SPACE_PREVIEW_URL=http://127.0.0.1:5127 node scripts/space-ui-preview/capture.mjs
```

If Playwright is installed outside this repository, set `PLAYWRIGHT_MODULE` to its
absolute `index.mjs` path. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing
Chromium executable. `SPACE_PREVIEW_URL` defaults to `http://127.0.0.1:5101` when
omitted. An optional first positional argument selects another image directory.

The default destination is `public/images/space/`. The script regenerates the
capture report alongside itself. Stop the Python server with Ctrl-C when finished.

## Coverage

The 1440 × 1000 captures cover Projects Overview (including selected project todos),
Data List (collapsed and expanded), rendered and historical file previews, Graph,
Tree, both Timeline modes, Manage, Inbox Items/Jobs/Sharing, Agents Overview,
Sessions and session details, the combined Trends charts, Configure, Wiki, Setup
Workspace/Intelligence layer/Commands/Server, command results, Quirq state,
Connectors with polling and action drawers, and the command palette.
Historical screenshot filenames remain stable where a page has moved or changed
name. `sessions-tools.png` and `sessions-models.png` now show sections within Trends.

Navigation, expansion, scrolling and selection use real browser interactions;
the script does not alter application DOM or CSS. Every capture checks the global
Wiki and GitHub links and the four primary tabs. The navigation review checks Wiki
at 1440, 390 and 320 pixels, its nine topics and fifteen documentation links, local
quick-start actions, the legacy Quirq help handoff, and primary shortcuts 1–4.
External link destinations receive a minimal test response, so those checks do
not contact hosted documentation or GitHub and do not validate published content.

Browser time, timezone and graph random seed are fixed. The script waits for data
and graph layout, checks expected project/connector/source/job counts, and fails
on browser, console or HTTP errors. Graph layout can vary slightly with browser
versions and rendering platforms. Captures use the default motion preference and
wait for graph camera transitions to finish.

## Fictional data and read boundaries

`fixtures.py` supplies ten fictional projects across engineering, operations,
documentation, research and marketing. Project text, identities, activity,
sessions, prompts, paths, connection state and issue links are invented. Example
paths use `/demo/`; the only identity email is `alex@example.com`. No real
workspace, credentials, native session stores or connected accounts are read.

The three commands, one interval job and retained results are fictional API
reads. Opening a result never executes a command. No project is cloned, shared,
removed or changed; no credential is saved; no command, restart or update runs.
The five native connector cards receive fabricated local status reads. No login,
provider polling, account removal or connector installation is performed.

Fixture contracts follow the source project catalog, visualizers, files/history,
sharing, session telemetry, Inbox, connections, Setup identity/runtime, native
connectors, Composio actions, telemetry source configuration and schedules APIs.
Codex and Cursor costs use `cost_known: false` / `cost_status: unavailable`; only
Claude Code has illustrative estimated costs. Configure uses the actual source
path keys `ARGUS_DB`, `CODEX_HOME` and `CURSOR_HOME`. Runtime Setup uses the five
native backend manifests. Account labels exist only for supported Gmail and
Calendar resolvers; action preferences use representative Gmail actions.

For Quirq, the server extracts literal output-contract declarations from
`services/cowork_agent/quirq_catalog.py` using Python AST without importing or
executing the service. It preserves synced, runtime and history tiers, including
the current workspace cache and project-history locations.

The server binds only to `127.0.0.1` and serves files only from the chosen
`space_ui` directory. API reads return fixtures. Its only accepted POST is the
automatic account-label lookup for unsupported demo providers; it returns no
identity and makes no upstream request. Other writes are rejected. This is
validation of documented UI states, not a test of a live Space backend.

## Script checks

```sh
python3 -m py_compile scripts/space-ui-preview/fixtures.py scripts/space-ui-preview/server.py
node --check scripts/space-ui-preview/capture.mjs
./node_modules/.bin/biome check scripts/space-ui-preview
```
