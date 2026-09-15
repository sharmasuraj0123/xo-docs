import type { ReactNode } from "react";
import { Figure } from "./figure";

function DownArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3 text-xs text-fd-muted-foreground">
      <span aria-hidden="true" className="text-lg text-fd-primary">
        ↓
      </span>
      {label}
    </div>
  );
}

function DataCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-fd-border bg-fd-background p-4">
      <div className="text-sm font-semibold text-fd-foreground">{title}</div>
      <div className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function SpaceDataFlow() {
  return (
    <Figure
      n="01"
      title="From work to a workspace view"
      caption="Space combines several sources. Coverage depends on the runtime, configured roots, and enabled features; a view does not imply a complete recording of every action."
    >
      <div className="p-4 sm:p-6">
        <div className="mb-3 text-xs font-medium uppercase tracking-widest text-fd-primary">
          Sources on your machine · optional connected apps
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <DataCard title="Agent records">
            Native conversations, usage counters, tool activity and session
            metadata.
          </DataCard>
          <DataCard title="Project records">
            Working files, Git history and portable .xo records maintained by
            project APIs.
          </DataCard>
          <DataCard title="Connected apps">
            Selected mail, calendar, page and message records, when polling is
            enabled.
          </DataCard>
        </div>
        <DownArrow label="Read, attribute to projects, and normalize" />
        <div className="rounded-xl border border-fd-primary/30 bg-fd-primary/5 p-4">
          <div className="text-sm font-semibold">Local Space services</div>
          <p className="mb-0 mt-2 text-xs leading-relaxed text-fd-muted-foreground">
            Runtime adapters · watcher · project services · Git scanners ·
            connector collectors. Different sources feed different views.
          </p>
        </div>
        <DownArrow label="Write machine-local records and derived views" />
        <div className="grid gap-3 sm:grid-cols-3">
          <DataCard title="Project history">
            Activity, session indexes, counters and timeline events.
          </DataCard>
          <DataCard title="Workspace views">
            Graph, Dashboard, Sessions and project rollups.
          </DataCard>
          <DataCard title="Service state">
            Cursors, live presence, Inbox and connector caches.
          </DataCard>
        </div>
        <div className="mt-3 text-center font-mono text-xs text-fd-muted-foreground">
          QUIRQ_STATE_ROOT · machine-local state
        </div>
        <DownArrow label="Serve local APIs to the browser" />
        <div className="rounded-xl bg-fd-secondary p-4 text-center text-sm font-medium">
          Projects · Agents · Inbox · Setup
        </div>
      </div>
    </Figure>
  );
}

function StorageBranch({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  return (
    <li className="min-w-0 border-l border-fd-border py-2 pl-4">
      <code className="break-words text-xs text-fd-foreground">{path}</code>
      <div className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">
        {children}
      </div>
    </li>
  );
}

export function SpaceStorageMap() {
  return (
    <Figure
      n="02"
      title="Three storage locations, three responsibilities"
      caption="Illustrative paths. The projects root, state root and native runtime homes can be configured independently. The tables below give the detailed inventory."
    >
      <div className="grid gap-6 p-4 sm:p-6">
        <section>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <strong className="text-sm">
              Portable workspace and project records
            </strong>
            <span className="text-xs text-fd-primary">
              Stored beside working files
            </span>
          </div>
          <ul className="mb-0 mt-3 list-none pl-0">
            <StorageBranch path="<projects root>/.xo/space.json">
              Workspace identity.
            </StorageBranch>
            <StorageBranch path="<projects root>/<project>/.xo/">
              Project identity, todos, workitems and peer records.
            </StorageBranch>
          </ul>
        </section>
        <section>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <strong className="text-sm">Machine-local Space state</strong>
            <span className="text-xs text-fd-primary">QUIRQ_STATE_ROOT</span>
          </div>
          <ul className="mb-0 mt-3 list-none pl-0">
            <StorageBranch path="<state root>/projects/<pid>/">
              Project history and indexes; keyed by project identity.
            </StorageBranch>
            <StorageBranch path="<state root>/cache/">
              Rebuildable workspace views, rollups, heartbeat and live presence.
            </StorageBranch>
            <StorageBranch path="<state root>/projects/">
              Workspace timeline and reading positions, beside project history.
            </StorageBranch>
            <StorageBranch path="inbox/ · connections/ · scheduler/ · sharing/ · usage/">
              Incoming work, connected-service records, saved commands, sharing
              decisions and reporting progress.
            </StorageBranch>
            <StorageBranch path="settings/ · secrets/ · logs/ · .locks/">
              Local choices, credentials, diagnostics and internal locks.
            </StorageBranch>
          </ul>
        </section>
        <section>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <strong className="text-sm">Native and ingestion stores</strong>
            <span className="text-xs text-fd-primary">Separate ownership</span>
          </div>
          <ul className="mb-0 mt-3 list-none pl-0">
            <StorageBranch path="Agent homes · native databases and logs">
              Original conversations and runtime records. Space reads supported
              data and can retain selected details in its own indexes.
            </StorageBranch>
            <StorageBranch path="Argus store">
              Separate Claude Code ingestion database used for aggregate usage.
            </StorageBranch>
          </ul>
        </section>
      </div>
    </Figure>
  );
}

const editSteps = [
  [
    "An agent edits a file",
    "The working file changes. A supported native runtime also records the tool activity in its own session store.",
  ],
  [
    "The watcher reads the next records",
    "An adapter attributes supported activity to a project. Saved cursors track how far the source has been read.",
  ],
  [
    "Space records an observable event",
    "A supported file touch becomes a timeline event with a timestamp, runtime, session ID and relative path. Other sinks maintain activity and counters.",
  ],
  [
    "Workspace views refresh",
    "Project records feed workspace rollups and materialized views. Their refresh schedule means the browser can briefly show an older result.",
  ],
  [
    "You inspect the result",
    "Use Projects → Data for files and Inbox → Activity for observed events. Opening a file reads its contents on demand; Git history supplies committed versions and Projects → Timeline's dated map.",
  ],
];

export function SpaceEventFlow() {
  return (
    <Figure
      n="03"
      title="One file edit, from source to inspection"
      caption="A supported native file-touch event is an activity record, not a copy of the edited file. Manual edits and runtimes without that event support may not follow this path."
    >
      <ol className="m-0 list-none space-y-0 p-4 sm:p-6">
        {editSteps.map(([title, detail], index) => (
          <li key={title} className="relative flex gap-4 pb-6 last:pb-0">
            {index < editSteps.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-3.5 top-8 border-l border-fd-primary/30"
              />
            )}
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fd-primary/10 text-xs font-semibold text-fd-primary">
              {index + 1}
            </span>
            <div className="min-w-0 pt-1">
              <div className="text-sm font-semibold">{title}</div>
              <p className="mb-0 mt-2 text-xs leading-relaxed text-fd-muted-foreground">
                {detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
