# Space documentation review

The Space guides follow xo-space `development` at
`522111900fa4224ef3914192b9eb78048fffb5e3` (the Projects navigation merge).
The website's documentation branch is independent of the product's release branch.

## Build and check the guides

Install the checked-in pnpm lockfile, then run:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm types:check
pnpm lint
```

With pnpm 9, this repository's workspace file (which only declares build settings)
requires `pnpm --ignore-workspace install --frozen-lockfile`. Scripts can also be
run with `npm run build`, `npm run types:check`, and `npm run lint` after that
installation. The npm lockfile currently differs from package.json; use the pnpm
lockfile for reproducible dependencies.

Start the site on the preview port:

```sh
./node_modules/.bin/next dev --hostname 127.0.0.1 --port 3101
```

With Playwright and Chromium installed:

```sh
node scripts/verify-space-docs.mjs /tmp/xo-space-docs-review
```

Optional environment variables:

- `DOCS_PREVIEW_URL`: site URL (default `http://127.0.0.1:3101`).
- `PLAYWRIGHT_MODULE`: path to an existing Playwright `index.mjs`.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE`: existing Chromium executable.

The script discovers every MDX page under `content/docs/space`, opens each in a
real browser, checks its title, decodes its images, follows internal article links
and anchors, and rejects page errors or horizontal overflow. It also captures
desktop and mobile documentation layouts. Results and screenshots go to the
output directory, outside the published website.

## Capture product screenshots

See [space-ui-preview](space-ui-preview/README.md) for the independent fixture
server and capture script. They serve an unchanged xo-space checkout using
fictional data; they do not authenticate to providers or run real agent tasks.
