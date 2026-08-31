"use client";

import type { AnyApiReferenceConfiguration } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import dynamic from "next/dynamic";
import { type FormEvent, useEffect, useMemo, useState } from "react";

const LOCAL_SERVER = "http://127.0.0.1:5002";

const ApiReference = dynamic(
  () =>
    import("@scalar/api-reference-react").then(
      (module) => module.ApiReferenceReact,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-96 items-center justify-center rounded-xl border bg-fd-muted/40 text-sm text-fd-muted-foreground">
        Loading the API explorer…
      </div>
    ),
  },
);

type ColorMode = "dark" | "light";

function normalizeServerUrl(value: string): string {
  const url = new URL(value.trim());

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Use an http:// or https:// space URL.");
  }
  if (url.username || url.password) {
    throw new Error("Do not put credentials in the space URL.");
  }
  if (url.search || url.hash) {
    throw new Error("Remove query parameters and fragments from the URL.");
  }

  return url.toString().replace(/\/$/, "");
}

function isLoopback(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return (
      hostname === "127.0.0.1" ||
      hostname === "localhost" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

export function CoworkApiReference() {
  const [draftServer, setDraftServer] = useState(LOCAL_SERVER);
  const [server, setServer] = useState(LOCAL_SERVER);
  const [error, setError] = useState<string | null>(null);
  const [liveRequestsEnabled, setLiveRequestsEnabled] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [isHostedPage, setIsHostedPage] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      setColorMode(root.classList.contains("dark") ? "dark" : "light");

    update();
    setIsHostedPage(window.location.protocol === "https:");
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const configuration = useMemo<AnyApiReferenceConfiguration>(
    () => ({
      url: "/openapi/xo-cowork-api.json",
      servers: [{ url: server, description: "Selected XO Space" }],
      persistAuth: false,
      telemetry: false,
      agent: { disabled: true },
      proxyUrl: undefined,
      layout: "modern",
      theme: "default",
      forceDarkModeState: colorMode,
      hideDarkModeToggle: true,
      hideTestRequestButton: !liveRequestsEnabled,
      hideClientButton: false,
      showDeveloperTools: "never",
      showOperationId: true,
      modelsSectionLabel: "Schemas",
      documentDownloadType: "direct",
      withDefaultFonts: false,
      searchHotKey: "l",
      customCss: `
        .scalar-app {
          --scalar-color-accent: ${colorMode === "dark" ? "#83d63a" : "#4d8c16"};
          --scalar-font: inherit;
        }
      `,
    }),
    [colorMode, liveRequestsEnabled, server],
  );

  function applyServer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const nextServer = normalizeServerUrl(draftServer);
      setServer(nextServer);
      setDraftServer(nextServer);
      setLiveRequestsEnabled(false);
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Enter a valid space URL.",
      );
    }
  }

  const hostedLoopbackWarning = isHostedPage && isLoopback(server);

  return (
    <div className="not-prose w-full" data-ph-no-capture data-private>
      <section
        className="mb-6 overflow-hidden rounded-2xl border bg-fd-card text-fd-card-foreground shadow-sm"
        aria-labelledby="cowork-connection-title"
      >
        <div className="border-b bg-fd-muted/40 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full border border-green-600/25 bg-green-500/10 px-2.5 py-1 text-green-700 dark:text-green-300">
                  Curated read-only API
                </span>
                <span className="rounded-full border px-2.5 py-1 text-fd-muted-foreground">
                  No request proxy
                </span>
                <span className="rounded-full border px-2.5 py-1 text-fd-muted-foreground">
                  Auth is not saved
                </span>
              </div>
              <h2
                id="cowork-connection-title"
                className="text-xl font-semibold"
              >
                Connect your space
              </h2>
              <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                Requests go directly from this browser to the URL below. Start
                with <code>GET /</code>, then inspect runtime status before
                reading space data.
              </p>
            </div>
            <a
              href="/api-reference/overview"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
            >
              Connection and auth guide
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <form className="contents" onSubmit={applyServer}>
            <div>
              <label
                htmlFor="cowork-server-url"
                className="mb-2 block text-sm font-medium"
              >
                Space API URL
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="cowork-server-url"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  value={draftServer}
                  onChange={(event) => setDraftServer(event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "cowork-server-error" : undefined}
                  className="min-w-0 flex-1 rounded-lg border bg-fd-background px-3.5 py-2.5 font-mono text-sm outline-none transition focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setDraftServer(LOCAL_SERVER)}
                  className="rounded-lg border px-3.5 py-2.5 text-sm font-medium transition hover:bg-fd-accent"
                >
                  Use local
                </button>
              </div>
              {error ? (
                <p
                  id="cowork-server-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </p>
              ) : (
                <p className="mt-2 text-xs leading-5 text-fd-muted-foreground">
                  Local: <code>{LOCAL_SERVER}</code>. Remote spaces should use
                  their authenticated HTTPS proxy URL.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition hover:opacity-90"
            >
              Apply server
            </button>
          </form>
        </div>

        <div className="border-t px-5 py-4 sm:px-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={liveRequestsEnabled}
              onChange={(event) => setLiveRequestsEnabled(event.target.checked)}
              className="mt-1 size-4 accent-[hsl(92,60%,28%)]"
            />
            <span>
              <span className="block text-sm font-medium">
                Enable “Test Request” for this real space
              </span>
              <span className="mt-1 block text-xs leading-5 text-fd-muted-foreground">
                I understand responses may contain local paths, agent names,
                session titles, messages, and usage data. Only the allowlisted
                GET operations below are included.
              </span>
            </span>
          </label>
        </div>

        {hostedLoopbackWarning ? (
          <div className="border-t border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm leading-6 text-amber-900 dark:text-amber-200 sm:px-6">
            A hosted HTTPS page may need browser local-network permission, and
            the Space API must allow this docs origin through CORS. For the most
            reliable local workflow, open a same-origin reference from the space
            or run these docs at <code>http://localhost:3100</code>.
          </div>
        ) : null}
      </section>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-fd-muted-foreground">
        <span>
          Active target: <code className="text-fd-foreground">{server}</code>
        </span>
        <span>
          Live requests: {liveRequestsEnabled ? "enabled" : "disabled"}
        </span>
      </div>

      <div className="cowork-scalar overflow-hidden rounded-2xl border bg-fd-background shadow-sm">
        <ApiReference
          key={`${server}-${colorMode}`}
          configuration={configuration}
        />
      </div>
    </div>
  );
}
