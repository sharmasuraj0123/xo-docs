# Space documentation screenshots

These screenshots show the actual, unmodified `space_ui` browser application from
[xo-space](https://github.com/quirq-ai/xo-space), with a fictional workspace supplied
by a local Python fixture server. They are browser captures, not visual mockups.

The checked-in images were captured from source revision
`84f0737e23b6bb369fc6b8853afb510a02dd8b21` on `fix/issue-105`, proposed in
[PR106](https://github.com/quirq-ai/xo-space/pull/106) against development.
It includes the merged compact Wiki and contextual toolbar, plus Setup's restart
and saved Commands controls.
`capture-report.json` records the captured revision,
every source UI asset hash, screenshot descriptions, PNG hashes and byte sizes,
and browser validation results. It contains no local checkout paths.

## Reproduce

Requirements: Python 3.9+, Node.js 18+, Git, Playwright and its Chromium browser.
Check out the source revision above in a sibling `xo-space` directory. The capture
script rejects a checkout with modified `space_ui` files.

From the `xo-docs` repository, start the fixture server:

```sh
python3 scripts/space-ui-preview/server.py --source ../xo-space --port 5101
```

In another terminal, run the capture script:

```sh
node scripts/space-ui-preview/capture.mjs
```

If Playwright is installed outside this repository, set `PLAYWRIGHT_MODULE` to its
absolute `index.mjs` path. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` when using an existing
Chromium executable rather than Playwright's default browser installation. Set
`SPACE_PREVIEW_URL` to override `http://127.0.0.1:5101`. An optional first positional
argument selects an alternate screenshot output directory.

The default destination is `public/images/space/`. The script regenerates the
capture report alongside itself. Stop the Python server with Ctrl-C when finished.

## What is captured

The 1440 × 1000 captures cover Dashboard (overview and selected project), Projects
List (collapsed and expanded), rendered and historical file previews, Graph, Tree,
Sharing, both Timeline modes, all five Sessions subviews and session details,
Inbox, Wiki, Setup and native runtime sources, saved Commands and run history,
Quirq state, and Connectors with
polling and action drawers. All navigation, expansion, scrolling and selection
uses real browser interactions; the script does not alter application DOM or CSS.

Every capture checks the top-right Wiki and GitHub links. After saving the images,
the script verifies the compact Wiki's nine topics, sixteen documentation links,
quick-start actions, the legacy Quirq help handoff, and the six primary tab
shortcuts at 1440, 390 and 320 pixels.
It checks that Wiki opens locally in the same tab, while topic documentation and
GitHub open a new tab and preserve the current Space view. Those external
destination requests receive a minimal test response, so this check does not
contact the hosted documentation or GitHub and does not validate their published
content. Screenshots contain only the real local Space UI.

Browser time, timezone and the graph's random seed are fixed. The script waits for
data and graph layout, verifies expected project/connector counts and selected
Dashboard content, and fails on browser, console or HTTP errors. Canvas layout
can still vary slightly with browser versions and rendering platforms. Captures
use the default motion preference and wait for the camera transition to finish.
At the pinned source revision, selecting a Dashboard project with reduced motion
can produce a negative canvas arc radius: the camera transition does not clamp a
negative frame-time delta. This documentation change does not fix that source bug.

## Fixture scope and contracts

`fixtures.py` supplies ten fictional projects across engineering, operations,
documentation, research and marketing. Project text, activity, accounts, sessions,
prompts, paths, connection state and issue links are invented. Example paths use
`/demo/`; the only identity email is `alex@example.com`. No real workspace content,
credentials, native session stores or connected accounts are read.

The three saved-command examples and their histories are fictional API reads.
No command is registered or executed and no restart is requested by this server
or the capture script. Real scheduler execution and restart lifecycle checks
belong to the product repository's isolated tests.

The fixtures follow the source contracts for the project catalog and visualizer
builders, project file/history and sharing endpoints, session telemetry adapters,
Inbox, connections, runtime configuration and Composio toolkits/actions. Codex
and Cursor telemetry use the source's `cost_known: false` and `cost_status:
unavailable` fields; only Claude Code has illustrative estimated costs. Runtime
Setup uses the five actual native backend manifests. Account identity is present
only for the supported Gmail and Calendar resolvers. The action drawer uses a
representative subset of Gmail actions with source-matched read/write categories.

For the Quirq panel, the server extracts the literal output-contract declarations
from `services/cowork_agent/quirq_catalog.py` using Python's AST, without importing
or executing the service. This preserves the revision's real synced/runtime tiers
and location prefixes, including the machine-local session indexes.

The server binds only to `127.0.0.1` and serves files only from the chosen
`space_ui` directory. API reads return fixtures. The sole accepted POST is the
automatic account-label lookup for unsupported demo providers; it returns no
identity and makes no upstream request. Other writes are rejected. OAuth, live
polling, mutations, updates and session replay are not exercised. This is evidence
of the documented UI states, not an end-to-end test of a running Space backend.

## Script checks

```sh
python3 -m py_compile scripts/space-ui-preview/fixtures.py scripts/space-ui-preview/server.py
node --check scripts/space-ui-preview/capture.mjs
./node_modules/.bin/biome check scripts/space-ui-preview
```
