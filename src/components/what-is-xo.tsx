"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BrandIcon } from "./brand-icon";

// What is XO — home page explainer. Theme-aware (fd-* tokens).
// Phosphor icon classes are written as literals so Tailwind generates them.

const SIGN_UP_URL = "https://app.xo.builders/sign-up";

const ICONS: Record<string, string> = {
  robot: "icon-[ph--robot-fill]",
  chat: "icon-[ph--chat-circle-fill]",
  shield: "icon-[ph--shield-check-fill]",
  slack: "icon-[ph--slack-logo-fill]",
  telegram: "icon-[ph--telegram-logo-fill]",
  whatsapp: "icon-[ph--whatsapp-logo-fill]",
  monitor: "icon-[ph--monitor-fill]",
  user: "icon-[ph--user-plus-fill]",
  rocket: "icon-[ph--rocket-fill]",
  check: "icon-[ph--check-bold]",
  caret: "icon-[ph--caret-down-bold]",
};

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = ICONS[name] ?? "icon-[ph--circle-fill]";
  return <span className={`${cls} ${className ?? ""}`} aria-hidden="true" />;
}

function AgentChip({
  slug,
  label,
  href,
}: {
  slug: string;
  label: string;
  href?: string;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-background px-2.5 py-1 text-xs text-fd-foreground";
  if (href) {
    return (
      <a
        href={href}
        className={`${className} transition-colors hover:border-fd-primary/50 hover:bg-fd-muted`}
      >
        <BrandIcon name={slug} size={12} />
        {label}
      </a>
    );
  }
  return (
    <span className={className}>
      <BrandIcon name={slug} size={12} />
      {label}
    </span>
  );
}

function TextChip({ icon, label }: { icon?: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-background px-2.5 py-1 text-xs text-fd-foreground">
      {icon ? <Icon name={icon} className="size-3.5" /> : null}
      {label}
    </span>
  );
}

type Step = {
  id: string;
  index: string;
  icon: string;
  title: string;
  time: string;
  summary: string;
  detail: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  external?: boolean;
  chips?: ReactNode;
};

const STEPS: Step[] = [
  {
    id: "sign-up",
    index: "01",
    icon: "user",
    title: "Sign up",
    time: "2 min",
    summary: "Create your account. Free Basic plan — no credit card.",
    detail:
      "Registration takes under two minutes. Pick a username, choose the free Basic plan, and you're in — no card, no install.",
    highlights: [
      "Free Basic plan",
      "No credit card required",
      "Bring your own model later",
    ],
    ctaLabel: "Create free account",
    href: SIGN_UP_URL,
    external: true,
  },
  {
    id: "pick-agent",
    index: "02",
    icon: "robot",
    title: "Pick an agent",
    time: "1 min",
    summary: "Choose a ready-made harness with its own workflow and interface.",
    detail:
      "Each template is a full harness: messaging gateways, coding agents, or a chat-first workspace. Pick the one that matches how you work.",
    highlights: [
      "Five ready-made templates",
      "Best if you want messaging, coding, or chat-first work",
      "Compare agents any time in the docs",
    ],
    ctaLabel: "Browse agents",
    href: "/docs/agents",
    chips: (
      <>
        <AgentChip
          slug="openclaw"
          label="OpenClaw"
          href="/docs/agents/openclaw"
        />
        <AgentChip
          slug="claude-code"
          label="Claude Code"
          href="/docs/agents/claude-code"
        />
        <AgentChip slug="hermes" label="Hermes" href="/docs/agents/hermes" />
        <AgentChip
          slug="antigravity"
          label="Antigravity"
          href="/docs/agents/antigravity"
        />
        <AgentChip
          slug="xo-cowork"
          label="XO Cowork"
          href="/docs/agents/xo-cowork"
        />
      </>
    ),
  },
  {
    id: "launch",
    index: "03",
    icon: "rocket",
    title: "Launch the workspace",
    time: "5 min",
    summary: "Spin up a secure cloud workspace and connect your model.",
    detail:
      "Open New Project, pick your template, connect Anthropic, OpenAI, or OpenRouter (API key or OAuth). Everything runs in a cloud browser IDE — nothing to install.",
    highlights: [
      "Isolated machine per project",
      "BYO API key or Claude/ChatGPT OAuth",
      "Cloud IDE — no local setup",
    ],
    ctaLabel: "Launch guide",
    href: "/docs/getting-started/launch-first-agent",
    chips: (
      <>
        <AgentChip slug="anthropic" label="Anthropic" />
        <AgentChip slug="openai" label="OpenAI" />
        <TextChip label="OpenRouter" />
      </>
    ),
  },
  {
    id: "talk",
    index: "04",
    icon: "chat",
    title: "Talk to your agent",
    time: "Go",
    summary: "Reach it from Slack, Telegram, WhatsApp, or the browser IDE.",
    detail:
      "Once the workspace is up, chat in the browser or connect the channels you already use. Manage restarts, services, and access from one dashboard.",
    highlights: [
      "Slack, Telegram, WhatsApp",
      "Browser IDE built in",
      "One dashboard for the whole team",
    ],
    ctaLabel: "Manage workspace",
    href: "/docs/getting-started/manage-workspace",
    chips: (
      <>
        <TextChip icon="slack" label="Slack" />
        <TextChip icon="telegram" label="Telegram" />
        <TextChip icon="whatsapp" label="WhatsApp" />
        <TextChip icon="monitor" label="Browser IDE" />
      </>
    ),
  },
];

/** How long click/keyboard selection pauses scroll-driven expansion. */
const SCROLL_LOCK_MS = 2200;
/** Debounce scroll-driven step changes so expansion feels calmer. */
const SCROLL_DEBOUNCE_MS = 220;
/** New step must beat the current by this much intersection ratio to switch. */
const SCROLL_HYSTERESIS = 0.12;

function StepConnector({ lit }: { lit: boolean }) {
  return (
    <div className="flex flex-col items-center py-3" aria-hidden="true">
      <div
        className={`h-7 w-px transition-colors duration-500 motion-reduce:transition-none ${
          lit ? "bg-fd-primary/60" : "bg-fd-border"
        }`}
      />
      <span
        className={`icon-[ph--arrow-down-bold] size-4 transition-colors duration-500 motion-reduce:transition-none ${
          lit ? "text-fd-primary" : "text-fd-muted-foreground/50"
        }`}
      />
      <div
        className={`h-7 w-px transition-colors duration-500 motion-reduce:transition-none ${
          lit ? "bg-fd-primary/60" : "bg-fd-border"
        }`}
      />
    </div>
  );
}

function FirstTenMinutes() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const userLockedUntil = useRef(0);
  const activeRef = useRef(active);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  activeRef.current = active;

  const selectStep = useCallback((index: number, source: "user" | "scroll") => {
    if (source === "user") {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
      userLockedUntil.current = Date.now() + SCROLL_LOCK_MS;
      setActive(index);
      return;
    }
    if (Date.now() < userLockedUntil.current) return;
    if (activeRef.current === index) return;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrollTimer.current = null;
      if (Date.now() < userLockedUntil.current) return;
      if (activeRef.current === index) return;
      setActive(index);
    }, SCROLL_DEBOUNCE_MS);
  }, []);

  // Expand the step nearest the viewport center as the user scrolls.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
          if (Number.isNaN(idx)) continue;
          ratios.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best = -1;
        let bestRatio = 0;
        for (const [idx, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        }
        if (best < 0 || bestRatio <= 0) return;

        const current = activeRef.current;
        const currentRatio = ratios.get(current) ?? 0;
        // Stay on the current step until another clearly wins — less flicker.
        if (best !== current && bestRatio < currentRatio + SCROLL_HYSTERESIS) {
          return;
        }
        selectStep(best, "scroll");
      },
      {
        // Narrower active band → more scroll distance per step change
        root: null,
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [selectStep]);

  const goToStep = (index: number) => {
    selectStep(index, "user");
    const el = stepRefs.current[index];
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="mt-10">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Your first 10 minutes
      </p>

      {/* Progress rail */}
      <div
        className="mb-4 flex items-center justify-center gap-1.5"
        aria-hidden="true"
      >
        {STEPS.map((step, i) => (
          <button
            key={step.id}
            type="button"
            onClick={() => goToStep(i)}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none ${
              i === active
                ? "w-8 bg-fd-primary"
                : i < active
                  ? "w-4 bg-fd-primary/50"
                  : "w-4 bg-fd-border"
            }`}
            aria-label={`Go to step ${step.index}: ${step.title}`}
          />
        ))}
      </div>

      <ol className="mx-auto flex max-w-2xl flex-col">
        {STEPS.map((step, i) => {
          const isActive = i === active;
          const isDone = i < active;
          const panelId = `${baseId}-panel-${step.id}`;
          const headerId = `${baseId}-header-${step.id}`;

          return (
            <li
              key={step.id}
              ref={(node) => {
                stepRefs.current[i] = node;
              }}
              data-step-index={i}
              className="scroll-mt-28"
            >
              <div
                className={`rounded-2xl border bg-fd-card transition-[border-color,box-shadow,background-color] duration-500 ease-out motion-reduce:transition-none ${
                  isActive
                    ? "border-fd-primary/50 shadow-sm ring-1 ring-fd-primary/15"
                    : isDone
                      ? "border-fd-border/80 bg-fd-card/80"
                      : "border-fd-border hover:border-fd-primary/30"
                }`}
              >
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => goToStep(i)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-500 motion-reduce:transition-none ${
                      isDone
                        ? "bg-fd-primary text-fd-primary-foreground"
                        : isActive
                          ? "bg-fd-primary/10 text-fd-primary"
                          : "bg-fd-muted text-fd-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <Icon name="check" className="size-4" />
                    ) : (
                      <Icon name={step.icon} className="size-5" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        {step.index}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isDone
                            ? "text-fd-muted-foreground line-through decoration-fd-border"
                            : "text-fd-foreground"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="rounded-full bg-fd-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        {step.time}
                      </span>
                    </span>
                    {!isActive ? (
                      <span className="mt-0.5 block truncate text-xs text-fd-muted-foreground">
                        {step.summary}
                      </span>
                    ) : null}
                  </span>

                  <Icon
                    name="caret"
                    className={`size-4 shrink-0 text-fd-muted-foreground transition-transform duration-500 ease-out motion-reduce:transition-none ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <section
                  id={panelId}
                  aria-labelledby={headerId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-fd-border px-4 pb-4 pt-3 sm:px-5">
                      <p className="text-sm leading-relaxed text-fd-muted-foreground">
                        {step.detail}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {step.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-fd-foreground"
                          >
                            <Icon
                              name="check"
                              className="mt-0.5 size-3.5 shrink-0 text-fd-primary"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {step.chips ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {step.chips}
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <a
                          href={step.href}
                          {...(step.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-3.5 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
                        >
                          {step.ctaLabel}
                          {step.external ? (
                            <span
                              className="icon-[ph--arrow-square-out-bold] size-3.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <span
                              className="icon-[ph--arrow-right-bold] size-3.5"
                              aria-hidden="true"
                            />
                          )}
                        </a>
                        {i < STEPS.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => goToStep(i + 1)}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
                          >
                            Next step
                            <span
                              className="icon-[ph--caret-right-bold] size-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {i < STEPS.length - 1 ? (
                <StepConnector lit={i <= active} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// What is XO — the 30-second explainer for the home page.
export function WhatIsXO() {
  return (
    <section className="not-prose mb-14">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
          What is XO?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
          The home for your AI agent team. XO runs your agents for you — launch
          a ready-made harness, bring your own model, and reach it from Slack,
          Telegram, or your browser.
        </p>
      </div>

      <div className="mt-2 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={SIGN_UP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Start free — first agent in 5 minutes
          </a>
          <a
            href="/getting-started"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-semibold text-fd-foreground transition-colors hover:bg-fd-muted"
          >
            Read the guide
          </a>
        </div>
        <p className="text-xs text-fd-muted-foreground">
          30-day free trial · No credit card · Bring your own model
        </p>
      </div>

      <FirstTenMinutes />

      <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-fd-primary/20 bg-fd-primary/5 px-5 py-4 text-center sm:flex-row sm:justify-center sm:gap-3">
        <Icon name="shield" className="size-5 shrink-0 text-fd-primary" />
        <span className="text-xs font-medium leading-relaxed text-fd-foreground sm:text-sm">
          Every agent runs in a secure, isolated cloud workspace — one
          dashboard, no local setup, no infra to manage.
        </span>
      </div>
    </section>
  );
}
