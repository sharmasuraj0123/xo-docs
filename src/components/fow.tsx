import type { ReactNode } from "react";

// Future of Work visual kit. Theme-aware (fd-* tokens), no external deps.
// Phosphor icon classes are written as literals so Tailwind generates them.

const ICONS: Record<string, string> = {
  userPlus: "icon-[ph--user-plus-fill]",
  users: "icon-[ph--users-fill]",
  user: "icon-[ph--user-fill]",
  brain: "icon-[ph--brain-fill]",
  robot: "icon-[ph--robot-fill]",
  clock: "icon-[ph--clock-fill]",
  identity: "icon-[ph--identification-card-fill]",
  budget: "icon-[ph--wallet-fill]",
  eye: "icon-[ph--eye-fill]",
  shield: "icon-[ph--shield-check-fill]",
  cube: "icon-[ph--cube-fill]",
  package: "icon-[ph--package-fill]",
  server: "icon-[ph--hard-drives-fill]",
  network: "icon-[ph--share-network-fill]",
  handshake: "icon-[ph--handshake-fill]",
  workflow: "icon-[ph--flow-arrow-fill]",
  rocket: "icon-[ph--rocket-fill]",
  code: "icon-[ph--code-fill]",
  refresh: "icon-[ph--arrows-clockwise-fill]",
  check: "icon-[ph--check-circle-fill]",
  target: "icon-[ph--target-fill]",
  gauge: "icon-[ph--gauge-fill]",
  tools: "icon-[ph--wrench-fill]",
  database: "icon-[ph--database-fill]",
  files: "icon-[ph--files-fill]",
  chat: "icon-[ph--chat-circle-fill]",
  building: "icon-[ph--buildings-fill]",
  lightning: "icon-[ph--lightning-fill]",
  scales: "icon-[ph--scales-fill]",
  sparkle: "icon-[ph--sparkle-fill]",
  trendDown: "icon-[ph--trend-down-fill]",
  trendUp: "icon-[ph--trend-up-fill]",
  arrow: "icon-[ph--arrow-right-fill]",
  briefcase: "icon-[ph--briefcase-fill]",
  ticket: "icon-[ph--ticket-fill]",
  report: "icon-[ph--file-text-fill]",
  receipt: "icon-[ph--receipt-fill]",
  slack: "icon-[ph--slack-logo-fill]",
  whatsapp: "icon-[ph--whatsapp-logo-fill]",
  github: "icon-[ph--github-logo-fill]",
  list: "icon-[ph--list-checks-fill]",
};

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = ICONS[name] ?? "icon-[ph--circle-fill]";
  return <span className={`${cls} ${className ?? ""}`} aria-hidden="true" />;
}

type Item = { icon: string; title: string; desc?: string };

export function PhaseHero({
  number,
  title,
  tagline,
  icon,
}: {
  number: string;
  title: string;
  tagline: string;
  icon: string;
}) {
  return (
    <div className="not-prose mb-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-5 p-6 sm:p-8">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-fd-primary/10 text-fd-primary">
          <Icon name={icon} className="size-8" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-fd-primary">
            Phase {number}
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-fd-foreground sm:text-3xl">
            {title}
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-fd-muted-foreground">
            {tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon,
  label,
  sub,
  tone = "muted",
}: {
  icon: string;
  label: string;
  sub?: string;
  tone?: "muted" | "primary";
}) {
  const toneCls =
    tone === "primary"
      ? "border-fd-primary/40 bg-fd-primary/10 text-fd-primary"
      : "border-fd-border bg-fd-background text-fd-muted-foreground";
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${toneCls}`}>
      <Icon name={icon} className="size-6 shrink-0" />
      <div className="min-w-0">
        <div className="text-sm font-medium text-fd-foreground">{label}</div>
        {sub ? <div className="text-xs">{sub}</div> : null}
      </div>
    </div>
  );
}

// Phase 1 signature: skill unbundles from time.
export function Unbundling() {
  return (
    <div className="not-prose my-6 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
      <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
        <div className="mb-3 text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">
          The old deal
        </div>
        <div className="space-y-2">
          <Tile icon="brain" label="Brain" sub="judgment, framing" />
          <Tile icon="tools" label="Skill" sub="practiced craft" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-fd-muted-foreground">
          <Icon name="clock" className="size-4" />
          Bought together, rationed by time
        </div>
      </div>

      <div className="flex justify-center text-fd-primary">
        <Icon name="arrow" className="size-7 rotate-90 sm:rotate-0" />
      </div>

      <div className="rounded-2xl border border-fd-primary/40 bg-fd-primary/5 p-5">
        <div className="mb-3 text-xs font-medium uppercase tracking-widest text-fd-primary">
          The unbundling
        </div>
        <div className="space-y-2">
          <Tile
            icon="brain"
            label="Brain stays human"
            sub="scarce, valuable"
            tone="muted"
          />
          <Tile
            icon="robot"
            label="Skill becomes runtime"
            sub="on demand, parallel"
            tone="primary"
          />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-fd-primary">
          <Icon name="lightning" className="size-4" />
          Bought separately, at marginal cost
        </div>
      </div>
    </div>
  );
}

export function Flow({ steps }: { steps: Item[] }) {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="relative rounded-2xl border border-fd-border bg-fd-card p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex size-9 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
              <Icon name={s.icon} className="size-5" />
            </div>
            <span className="text-xs font-semibold text-fd-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="text-sm font-medium text-fd-foreground">
            {s.title}
          </div>
          {s.desc ? (
            <div className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">
              {s.desc}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function FeatureGrid({
  items,
  cols = 2,
}: {
  items: Item[];
  cols?: 2 | 3 | 4;
}) {
  const colCls =
    cols === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : cols === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";
  return (
    <div className={`not-prose my-6 grid gap-3 ${colCls}`}>
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-2xl border border-fd-border bg-fd-card p-4"
        >
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
            <Icon name={it.icon} className="size-5" />
          </div>
          <div className="text-sm font-medium text-fd-foreground">
            {it.title}
          </div>
          {it.desc ? (
            <div className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">
              {it.desc}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Column({
  icon,
  title,
  items,
  tone,
}: {
  icon: string;
  title: string;
  items: string[];
  tone: "muted" | "primary";
}) {
  const head =
    tone === "primary"
      ? "bg-fd-primary/10 text-fd-primary"
      : "bg-fd-muted text-fd-foreground";
  return (
    <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
      <div
        className={`mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${head}`}
      >
        <Icon name={icon} className="size-5" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((t) => (
          <li
            key={t}
            className="flex items-start gap-2 text-sm text-fd-muted-foreground"
          >
            <Icon
              name="check"
              className="mt-0.5 size-4 shrink-0 text-fd-primary"
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SplitCompare({
  left,
  right,
}: {
  left: { icon: string; title: string; items: string[] };
  right: { icon: string; title: string; items: string[] };
}) {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      <Column {...left} tone="muted" />
      <Column {...right} tone="primary" />
    </div>
  );
}

export function TrendChart({
  label,
  caption,
  direction = "down",
}: {
  label: string;
  caption?: string;
  direction?: "down" | "up";
}) {
  const down = direction === "down";
  const path = down
    ? "M8,28 C70,40 120,60 180,92 C220,112 280,124 312,128"
    : "M8,128 C70,116 120,96 180,64 C220,44 280,32 312,28";
  const area = `${path} L312,148 L8,148 Z`;
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-fd-foreground">{label}</div>
        <span className="inline-flex items-center gap-1 rounded-full bg-fd-primary/10 px-2.5 py-1 text-xs font-medium text-fd-primary">
          <Icon name={down ? "trendDown" : "trendUp"} className="size-4" />
          {down ? "lower is better" : "higher is better"}
        </span>
      </div>
      <svg
        viewBox="0 0 320 150"
        className="h-28 w-full text-fd-primary"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <path d={area} fill="currentColor" opacity="0.12" />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {caption ? (
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

function Node({
  icon,
  label,
  highlight,
}: {
  icon: string;
  label: string;
  highlight?: boolean;
}) {
  const cls = highlight
    ? "border-fd-primary/40 bg-fd-primary/10 text-fd-primary"
    : "border-fd-border bg-fd-background text-fd-foreground";
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${cls}`}
    >
      <Icon name={icon} className="size-5 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function Lane({
  label,
  middleIcon,
  middleLabel,
  badges,
  highlight,
}: {
  label: string;
  middleIcon: string;
  middleLabel: string;
  badges: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${highlight ? "border-fd-primary/40 bg-fd-primary/5" : "border-fd-border bg-fd-card"}`}
    >
      <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-fd-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Node icon="chat" label="Intent" />
        <Icon
          name="arrow"
          className="size-5 shrink-0 text-fd-muted-foreground"
        />
        <Node icon={middleIcon} label={middleLabel} highlight={highlight} />
        <Icon
          name="arrow"
          className="size-5 shrink-0 text-fd-muted-foreground"
        />
        <Node icon="check" label="Outcome" />
        <div className="ml-auto flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b}
              className={`rounded-full px-2.5 py-1 text-xs ${highlight ? "bg-fd-primary/10 text-fd-primary" : "bg-fd-muted text-fd-muted-foreground"}`}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Same shape as today (intent in, outcome out), only more efficient.
export function IntentOutcome() {
  return (
    <div className="not-prose my-6 space-y-3">
      <Lane
        label="Today"
        middleIcon="users"
        middleLabel="A team or agency"
        badges={["weeks", "fixed headcount", "billed by the hour"]}
      />
      <Lane
        label="With XO agents"
        middleIcon="robot"
        middleLabel="A fleet of agents"
        badges={["hours", "on demand", "per unit of work"]}
        highlight
      />
    </div>
  );
}

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-fd-muted px-2 py-0.5 text-xs text-fd-muted-foreground">
      <Icon name={icon} className="size-3.5" />
      {label}
    </span>
  );
}

function SessionRow({
  intent,
  status,
}: {
  intent: string;
  status: "done" | "running";
}) {
  const done = status === "done";
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-3">
      <div className="flex items-center gap-2">
        <Icon name="target" className="size-4 shrink-0 text-fd-primary" />
        <span className="text-sm font-medium text-fd-foreground">{intent}</span>
        <span
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${done ? "bg-fd-primary/10 text-fd-primary" : "bg-fd-muted text-fd-muted-foreground"}`}
        >
          <Icon name={done ? "check" : "clock"} className="size-3.5" />
          {done ? "done" : "running"}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Pill icon="budget" label="budget" />
        <Pill icon="eye" label="state check" />
        <Pill icon="gauge" label="token meter" />
      </div>
    </div>
  );
}

// One XO workspace, many sessions, each scoped to an intent and tracked on its own.
export function WorkspaceSessions() {
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
          <Icon name="cube" className="size-5" />
        </div>
        <div>
          <div className="text-sm font-medium text-fd-foreground">
            XO workspace
          </div>
          <div className="text-xs text-fd-muted-foreground">
            One session per intent, each tracked on its own
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <SessionRow intent="Clear the support backlog" status="done" />
        <SessionRow intent="Review Q3 vendor contracts" status="running" />
        <SessionRow intent="Ship the weekly metrics report" status="done" />
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-fd-primary/5 p-3 text-xs font-medium text-fd-primary">
        <Icon name="scales" className="size-4 shrink-0" />
        Priced per intent and outcome, not per token.
      </div>
    </div>
  );
}

// The mechanism: a unit of work is settled by comparing state and comparing cost.
export function StateAndCost() {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-fd-muted px-3 py-1.5 text-sm font-medium text-fd-foreground">
          <Icon name="eye" className="size-5" />
          Did the state change?
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Node icon="clock" label="State before" />
          <Icon
            name="arrow"
            className="size-5 shrink-0 text-fd-muted-foreground"
          />
          <Node icon="check" label="State after" highlight />
        </div>
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          Compare the two, the same check a manager makes today. If the world
          moved the way you asked, the work is done.
        </div>
      </div>

      <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-fd-muted px-3 py-1.5 text-sm font-medium text-fd-foreground">
          <Icon name="scales" className="size-5" />
          What did it cost?
        </div>
        <div className="mb-2 text-xs font-medium text-fd-muted-foreground">
          Budget (the price)
        </div>
        <div className="flex h-9 w-full overflow-hidden rounded-lg border border-fd-border">
          <div
            className="flex items-center justify-center bg-fd-primary/15 text-xs font-medium text-fd-primary"
            style={{ width: "60%" }}
          >
            AI spend
          </div>
          <div
            className="flex items-center justify-center bg-fd-primary text-xs font-medium text-fd-primary-foreground"
            style={{ width: "40%" }}
          >
            efficiency
          </div>
        </div>
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          The budget is what the outcome is worth. The tokens are where the AI
          spends, on the model you bring. XO only enables the tracking; the gap
          is your efficiency.
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <Icon name="arrow" className="size-5 shrink-0 text-fd-muted-foreground" />
  );
}

// Phase 2: work passes between agents, identity carried across each handoff.
export function Handoff() {
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Node icon="chat" label="Intent" />
        <Arrow />
        <Node icon="robot" label="Agent A" highlight />
        <Arrow />
        <Node icon="robot" label="Agent B" highlight />
        <Arrow />
        <Node icon="check" label="Outcome" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-xs text-fd-muted-foreground">
          <Icon name="identity" className="size-4" />
          Identity carried across every handoff
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-fd-primary/10 px-2.5 py-1 text-xs font-medium text-fd-primary">
          <Icon name="network" className="size-4" />
          REST today, streaming next
        </span>
      </div>
    </div>
  );
}

// Phase 3: agents run a continuous improvement loop under human guardrails.
export function Cycle() {
  const steps = [
    { icon: "code", label: "Propose" },
    { icon: "check", label: "Test" },
    { icon: "rocket", label: "Deploy" },
    { icon: "eye", label: "Observe" },
  ];
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <span key={s.label} className="flex items-center gap-2">
            <Node icon={s.icon} label={s.label} highlight />
            {i < steps.length - 1 ? <Arrow /> : null}
          </span>
        ))}
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-fd-primary/10 px-2.5 py-1 text-xs font-medium text-fd-primary">
          <Icon name="refresh" className="size-4" />
          and repeats
        </span>
      </div>
      <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
        Agents run this loop continuously. Humans set the direction and the
        guardrails.
      </div>
    </div>
  );
}

// --- Unit of work research note visuals ---

// Figure 1: a prompt vs a unit of work inside a workspace.
export function UowAnatomy() {
  const lacks = [
    "One instruction",
    "No state, no files",
    "No budget, no record",
    "Nothing to verify",
  ];
  const needs = [
    { icon: "rocket", label: "Runtime" },
    { icon: "database", label: "Memory" },
    { icon: "files", label: "Files" },
    { icon: "tools", label: "Tools" },
    { icon: "budget", label: "Budget" },
    { icon: "eye", label: "Record" },
  ];
  return (
    <div className="not-prose my-6 grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1.5fr]">
      <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-fd-muted px-3 py-1.5 text-sm font-medium text-fd-foreground">
          <Icon name="chat" className="size-5" />A prompt
        </div>
        <ul className="space-y-2">
          {lacks.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2 text-sm text-fd-muted-foreground"
            >
              <span
                className="icon-[ph--x-circle-fill] mt-0.5 size-4 shrink-0 opacity-50"
                aria-hidden="true"
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center text-fd-primary">
        <Icon name="arrow" className="size-7 rotate-90 sm:rotate-0" />
      </div>

      <div className="rounded-2xl border border-dashed border-fd-primary/50 bg-fd-primary/5 p-5">
        <div className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-fd-primary">
          The workspace
        </div>
        <div className="mb-3 flex justify-center">
          <div className="rounded-xl border border-fd-primary/40 bg-fd-primary/10 px-4 py-2.5 text-center">
            <div className="text-sm font-semibold text-fd-primary">
              Unit of work
            </div>
            <div className="text-xs text-fd-muted-foreground">
              an outcome with an owner
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {needs.map((n) => (
            <div
              key={n.label}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-2 py-2 text-xs font-medium text-fd-foreground"
            >
              <Icon name={n.icon} className="size-4 text-fd-primary" />
              {n.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Figure 2: handoffs without and with a shared unit of work.
export function UowCollaboration() {
  return (
    <div className="not-prose my-6 space-y-3">
      <div className="rounded-2xl border border-fd-border bg-fd-card p-4">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-fd-muted-foreground">
          Without a shared unit
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Node icon="user" label="Human" />
          <Icon
            name="refresh"
            className="size-5 shrink-0 text-fd-muted-foreground"
          />
          <Node icon="robot" label="Agent A" />
          <Icon
            name="refresh"
            className="size-5 shrink-0 text-fd-muted-foreground"
          />
          <Node icon="robot" label="Agent B" />
          <span className="text-fd-muted-foreground">···</span>
          <Node icon="chat" label="Result?" />
        </div>
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          Prompts back and forth, context lost at every hop, no one owns the
          outcome.
        </div>
      </div>

      <div className="rounded-2xl border border-fd-primary/40 bg-fd-primary/5 p-4">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-fd-primary">
          With units of work
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Node icon="user" label="Human" />
          <Arrow />
          <Node icon="cube" label="Unit · Agent A" highlight />
          <Arrow />
          <Node icon="cube" label="Unit · Agent B" highlight />
          <Arrow />
          <Node icon="check" label="Done" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-fd-foreground">
            Carried across every handoff:
          </span>
          {["definition of done", "budget", "identity", "state", "record"].map(
            (b) => (
              <span
                key={b}
                className="rounded-full bg-fd-primary/10 px-2.5 py-1 text-xs text-fd-primary"
              >
                {b}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

// Figure 3: the environment owns the ground truth around the agent.
export function UowEnvironment() {
  return (
    <div className="not-prose my-6 grid items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
      <div className="flex sm:flex-col items-center gap-2">
        <Node icon="target" label="Define" />
        <Icon
          name="arrow"
          className="size-5 text-fd-muted-foreground rotate-90 sm:rotate-0"
        />
      </div>

      <div className="rounded-2xl border border-fd-primary/50 bg-fd-primary/5 p-5">
        <div className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-fd-primary">
          The environment
        </div>
        <div className="mb-4 text-center text-xs text-fd-muted-foreground">
          runtime · memory · files · tools · budget · record
        </div>
        <div className="mb-3 flex justify-center">
          <Node icon="robot" label="Agent" />
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          <Node icon="clock" label="State before" />
          <Arrow />
          <Node icon="check" label="State after" highlight />
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-fd-background/60 border border-fd-border p-3 text-xs leading-relaxed text-fd-muted-foreground">
          <Icon
            name="gauge"
            className="mt-0.5 size-4 shrink-0 text-fd-primary"
          />
          <span>
            <span className="font-medium text-fd-foreground">
              Everything is metered as it happens.{" "}
            </span>
            Tool calls, tokens, and files are recorded by the environment, not
            reported by the agent.
          </span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center gap-2">
        <Icon
          name="arrow"
          className="size-5 text-fd-muted-foreground rotate-90 sm:rotate-0"
        />
        <Node icon="scales" label="Verify + settle" />
      </div>
    </div>
  );
}

// Figure 4: how a unit of work is calculated: snapshot, diff, score, settle.
export function UowCalculation() {
  const checks = [
    { label: "status = closed", w: "0.5", pass: true },
    { label: "reply sent", w: "0.3", pass: true },
    { label: "KB article linked", w: "0.2", pass: false },
  ];
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Node icon="clock" label="Snapshot S₀" />
        <Arrow />
        <Node icon="robot" label="Agent executes" />
        <Arrow />
        <Node icon="eye" label="Snapshot S₁" highlight />
        <Arrow />
        <Node icon="scales" label="Score V = Σwᵢ·gᵢ(S₁)" highlight />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {checks.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-3 py-2 text-xs"
          >
            <span
              className={`${c.pass ? "icon-[ph--check-circle-fill] text-fd-primary" : "icon-[ph--x-circle-fill] opacity-50"} size-4 shrink-0`}
              aria-hidden="true"
            />
            <span className="text-fd-foreground">{c.label}</span>
            <span className="ml-auto text-fd-muted-foreground">w = {c.w}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-fd-primary/5 p-3 text-xs">
        <span className="font-medium text-fd-primary">
          V = 0.5 + 0.3 + 0 = 0.8 → below τ = 1.0, one check left to fix
        </span>
        <span className="text-fd-muted-foreground">
          settle when V ≥ τ : compare budget B against metered cost C
        </span>
      </div>
    </div>
  );
}

// Figure 5: token cost per similar unit: flat without an environment, decaying with one.
export function UowLearningCurve() {
  const flat = "M8,38 L312,38";
  const curve = "M8,38 C36,78 70,96 130,106 C190,113 256,116 312,118";
  const area = `${curve} L312,148 L8,148 Z`;
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium text-fd-foreground">
          Tokens per similar unit of work
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-fd-muted-foreground">
            <span className="h-0.5 w-5 rounded bg-fd-muted-foreground/60" />
            without an environment
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-fd-primary">
            <span className="h-0.5 w-5 rounded bg-fd-primary" />
            with a persistent environment
          </span>
        </div>
      </div>
      <svg
        viewBox="0 0 320 150"
        className="h-32 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Token cost per similar unit: constant without an environment, decaying toward an execution floor with one"
      >
        <path d={area} className="fill-fd-primary" opacity="0.1" />
        <path
          d={flat}
          fill="none"
          className="stroke-fd-muted-foreground"
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.7"
        />
        <path
          d={curve}
          fill="none"
          className="stroke-fd-primary"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-fd-muted-foreground">
        <span>unit 1 (cold start: both pay full intent cost)</span>
        <span>unit 50 (environment pays only the execution floor)</span>
      </div>
    </div>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="not-prose my-5 border-l-2 border-fd-primary pl-4 text-base leading-relaxed text-fd-foreground">
      {children}
    </p>
  );
}

// quirq: the two meters, side by side, with the ratios that join them.
export function TwoMeters() {
  return (
    <div className="not-prose my-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-fd-muted px-3 py-1.5 text-sm font-medium text-fd-foreground">
            <Icon name="lightning" className="size-5" />
            Token: the input meter
          </div>
          <div className="flex flex-wrap gap-2">
            <Node icon="gauge" label="Compute consumed" />
            <Node icon="lightning" label="Energy and carbon" />
            <Node icon="scales" label="Inference cost" />
          </div>
          <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
            What the machine drew from the world. Real accounting, wrong side of
            the ledger for value.
          </div>
        </div>
        <div className="rounded-2xl border border-fd-primary/40 bg-fd-card p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-fd-primary/10 px-3 py-1.5 text-sm font-medium text-fd-primary">
            <Icon name="check" className="size-5" />
            quirq: the output meter
          </div>
          <div className="flex flex-wrap gap-2">
            <Node icon="check" label="Outcomes verified" highlight />
            <Node icon="budget" label="Owner-valued (B)" highlight />
            <Node icon="eye" label="Minted, never reported" highlight />
          </div>
          <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
            What the machine changed in the world, at the value a human set.
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-fd-border bg-fd-muted/40 px-5 py-3 text-center text-xs font-medium text-fd-muted-foreground">
        divide them →{" "}
        <span className="text-fd-primary">quirqs per dollar (QER)</span> ·{" "}
        <span className="text-fd-primary">quirqs per kWh</span> ·{" "}
        <span className="text-fd-primary">quirqs per tonne CO₂</span> · track
        over time → the AI effectiveness trajectory
      </div>
    </div>
  );
}

// quirq: the mint pipeline, from owner budget to ledger entry.
export function MintFlow() {
  return (
    <div className="not-prose my-6 rounded-2xl border border-fd-border bg-fd-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Node icon="user" label="Owner budgets B" />
        <Arrow />
        <Node icon="clock" label="Snapshot S₀" />
        <Arrow />
        <Node icon="robot" label="Agent executes (metered)" />
        <Arrow />
        <Node icon="eye" label="Snapshot S₁" />
        <Arrow />
        <Node icon="target" label="Checks score V" />
        <Arrow />
        <Node icon="check" label="Mint Q = V · B" highlight />
        <Arrow />
        <Node icon="files" label="Ledger" />
      </div>
      <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
        The worker never produces its own evidence: the environment captures
        both snapshots, re-runs every check, meters every action, and writes the
        hash-chained record. Value in is human judgment; everything after is
        machinery.
      </div>
    </div>
  );
}

// quirq: the same quarter read through each meter.
export function QerQuarter() {
  const months = [
    { m: "Apr", spend: 55, qer: 55, spendLabel: "$5.0k", qerLabel: "3.1×" },
    { m: "May", spend: 71, qer: 73, spendLabel: "$6.5k", qerLabel: "4.1×" },
    { m: "Jun", spend: 75, qer: 100, spendLabel: "$6.8k", qerLabel: "5.6×" },
  ];
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-fd-border bg-fd-card p-5">
        <div className="mb-3 text-sm font-medium text-fd-foreground">
          The bill alone: spend nearly doubles
        </div>
        <div className="flex h-28 items-end gap-4">
          {months.map((x) => (
            <div key={x.m} className="flex flex-1 flex-col items-center gap-1">
              <div className="text-xs font-medium text-fd-muted-foreground">
                {x.spendLabel}
              </div>
              <div
                className="w-full rounded-t-lg bg-fd-muted-foreground/30"
                style={{ height: `${x.spend}%` }}
              />
              <div className="text-xs text-fd-muted-foreground">{x.m}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          +83% cost, indistinguishable from waste. An expense line.
        </div>
      </div>
      <div className="rounded-2xl border border-fd-primary/40 bg-fd-card p-5">
        <div className="mb-3 text-sm font-medium text-fd-foreground">
          The quirq ledger: value per dollar up 81%
        </div>
        <div className="flex h-28 items-end gap-4">
          {months.map((x) => (
            <div key={x.m} className="flex flex-1 flex-col items-center gap-1">
              <div className="text-xs font-medium text-fd-primary">
                {x.qerLabel}
              </div>
              <div
                className="w-full rounded-t-lg bg-fd-primary"
                style={{ height: `${x.qer}%` }}
              />
              <div className="text-xs text-fd-muted-foreground">{x.m}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          Same quarter: QER 3.1× → 5.6× while intervention fell a third. An
          investment case.
        </div>
      </div>
    </div>
  );
}
