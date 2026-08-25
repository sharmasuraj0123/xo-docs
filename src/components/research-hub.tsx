"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ResearchPageItem = {
  url: string;
  slugs: string[];
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  imageUrl: string;
  track: "speed-trials" | "from-the-desk" | "proving-grounds";
  num: string;
  readTime: string;
};

const TRACKS = {
  all: {
    label: "All Research",
    manifesto: "",
  },
  "speed-trials": {
    label: "Speed Trials",
    manifesto:
      "Speed Trials — The same work, under changed conditions. A fixed unit of work, run across the matrix: environments, hardware, clouds, models, harnesses.",
  },
  "from-the-desk": {
    label: "From the Desk",
    manifesto:
      "From the Desk — What we learned reading the field. Other labs' published results, checked against primary sources. When a piece points at a testable question, it graduates.",
  },
  "proving-grounds": {
    label: "Proving Grounds",
    manifesto:
      "Proving Grounds — The external trials. Real work, real verticals, challenged conditions.",
  },
};

export function ResearchHub({ items }: { items: ResearchPageItem[] }) {
  const [activeTab, setActiveTab] = useState<keyof typeof TRACKS>("all");

  const counts = useMemo(() => {
    return {
      all: items.length,
      "speed-trials": items.filter((n) => n.track === "speed-trials").length,
      "from-the-desk": items.filter((n) => n.track === "from-the-desk").length,
      "proving-grounds": items.filter((n) => n.track === "proving-grounds")
        .length,
    };
  }, [items]);

  // Featured article (first Speed Trial / Observational Data)
  const featured = useMemo(() => {
    return (
      items.find(
        (n) =>
          n.url.includes("observational-data") ||
          n.title.toLowerCase().includes("workspace context") ||
          n.title.toLowerCase().includes("observational data"),
      ) || items[0]
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      // Don't repeat featured item in the grid when in "all" view if it's prominently featured
      return items.filter((n) => n.url !== featured?.url);
    }
    return items.filter(
      (n) =>
        n.track === activeTab &&
        n.url !== (activeTab === "speed-trials" ? featured?.url : ""),
    );
  }, [items, activeTab, featured]);

  const showFeatured = activeTab === "all" || activeTab === "speed-trials";
  const showProvingGrounds =
    activeTab === "all" || activeTab === "proving-grounds";

  return (
    <div className="min-h-screen bg-fd-background text-fd-foreground">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Header with Title & Filter Tabs */}
        <header className="flex flex-wrap items-baseline justify-between gap-6 pb-6 border-b border-fd-border">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground mb-2">
              Empirical AI Research
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Research
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(TRACKS) as Array<keyof typeof TRACKS>).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveTab(k)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  activeTab === k
                    ? "border-fd-primary bg-fd-primary text-fd-primary-foreground shadow-sm"
                    : "border-fd-border bg-fd-card/70 text-fd-muted-foreground hover:border-fd-foreground/30 hover:text-fd-foreground"
                }`}
              >
                <span>{TRACKS[k].label}</span>
                <span
                  className={`text-[10px] ${
                    activeTab === k
                      ? "text-fd-primary-foreground/70"
                      : "text-fd-muted-foreground/60"
                  }`}
                >
                  {counts[k]}
                </span>
              </button>
            ))}
          </div>
        </header>

        {/* Manifesto banner when tab is selected */}
        {TRACKS[activeTab].manifesto ? (
          <div className="py-4 text-sm text-fd-muted-foreground italic border-b border-fd-border/50">
            {TRACKS[activeTab].manifesto}
          </div>
        ) : null}

        {/* FEATURED POST */}
        {showFeatured && featured ? (
          <section className="mt-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card/50 transition-all hover:border-fd-primary/40">
            <Link
              href={featured.url}
              className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-fd-border bg-[#0c0c0e]">
                <Image
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-fd-primary">
                  <span className="size-2 rounded-full bg-fd-primary" />
                  <span>Speed Trials · Featured Experiment</span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-fd-foreground sm:text-3xl lg:text-4xl leading-tight">
                  {featured.title}
                </h2>

                {featured.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground line-clamp-3 sm:text-base">
                    {featured.description}
                  </p>
                ) : null}

                <div className="mt-6 flex items-center justify-between border-t border-fd-border/50 pt-4 text-xs font-mono uppercase tracking-wider text-fd-muted-foreground">
                  <span>
                    {featured.date} · {featured.readTime}
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full border border-fd-border text-fd-foreground transition-all hover:border-fd-primary hover:text-fd-primary">
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {/* 2-CARD ROW: WHITEPAPER & CALCULATOR */}
        {activeTab === "all" ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Whitepaper Card */}
            <a
              href="/docs/quirq"
              className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-all hover:border-fd-primary/50 hover:shadow-md"
            >
              <div className="flex w-full sm:w-44 shrink-0 flex-col justify-between bg-[#efede6] p-4 text-[#17171a] dark:bg-[#1a1a1f] dark:text-[#f2f2f0]">
                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest opacity-60">
                    Whitepaper · v3
                  </span>
                  <h4 className="mt-2 text-xs font-bold leading-snug">
                    quirq: a unit of work for intelligence
                  </h4>
                </div>
                <div className="mt-4 space-y-1.5 opacity-30">
                  <div className="h-1 w-full rounded-full bg-current" />
                  <div className="h-1 w-4/5 rounded-full bg-current" />
                  <div className="h-1 w-3/4 rounded-full bg-current" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-base font-bold text-fd-foreground group-hover:text-fd-primary transition-colors">
                    The Whitepaper
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
                    A quirq is minted, never self-reported — budgeted outcome,
                    before/after snapshots, verification mints delivered work.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground pt-2 border-t border-fd-border/40">
                  <span>Suraj Sharma · quirq labs</span>
                  <span className="text-fd-primary font-bold">Read ↗</span>
                </div>
              </div>
            </a>

            {/* Calculator Card */}
            <a
              href="https://www.xo.builders/whitepaper/visualize"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-all hover:border-fd-primary/50 hover:shadow-md"
            >
              <div className="flex w-full sm:w-44 shrink-0 flex-col justify-between border-b sm:border-b-0 sm:border-r border-fd-border bg-[#0f1117] p-4 text-white">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-fd-muted-foreground">
                  <span>Cost / Run</span>
                  <span className="text-[#56b3a5] font-bold">−42%</span>
                </div>
                <svg
                  viewBox="0 0 140 44"
                  className="my-2 w-full"
                  role="img"
                  aria-label="Cost per run reduction chart"
                >
                  <title>Cost per run reduction chart</title>
                  <line
                    x1="0"
                    y1="7"
                    x2="140"
                    y2="7"
                    stroke="rgba(255,255,255,.2)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M0 9 C 28 26, 52 33, 140 35"
                    fill="none"
                    stroke="#56b3a5"
                    strokeWidth="2"
                  />
                  <circle cx="140" cy="35" r="3" fill="#56b3a5" />
                </svg>
                <div className="relative h-1 w-full rounded-full bg-white/10">
                  <div className="absolute left-0 top-0 h-full w-1/3 rounded-full bg-[#56b3a5]" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-base font-bold text-fd-foreground group-hover:text-fd-primary transition-colors">
                    Unit of Work Calculator
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground">
                    The paper's worked ledger, live — cost per run, budget vs
                    spend. Validate with your own numbers.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground pt-2 border-t border-fd-border/40">
                  <span className="text-[#56b3a5] font-bold">
                    Interactive Tool
                  </span>
                  <span className="text-fd-primary font-bold">Open ↗</span>
                </div>
              </div>
            </a>
          </div>
        ) : null}

        {/* PROVING GROUNDS EMPTY / PARTNER STATE */}
        {showProvingGrounds ? (
          <section className="mt-8 rounded-2xl border border-dashed border-fd-border bg-gradient-to-r from-fd-card/90 via-fd-card/50 to-fd-muted/30 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Proving Grounds</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-fd-foreground sm:text-2xl">
                  We're testing work environment efficiency.
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-fd-muted-foreground sm:text-sm">
                  No longer is AI token spend the only metric for businesses.
                  Let's prove real output across industry rails.
                </p>
              </div>

              <div className="space-y-2.5 border-l-2 border-amber-400/30 pl-5 text-xs">
                <div>
                  <span className="font-mono font-bold uppercase tracking-wider text-amber-400">
                    quirq × Nevermined
                  </span>{" "}
                  <span className="text-fd-muted-foreground">
                    — settlement rails for verified agent work
                  </span>
                </div>
                <div>
                  <span className="font-mono font-bold uppercase tracking-wider text-amber-400">
                    quirq × Shodai
                  </span>{" "}
                  <span className="text-fd-muted-foreground">
                    — agents transacting under signed agreements, settled in
                    quirqs
                  </span>
                </div>
                <div>
                  <span className="font-mono font-bold uppercase tracking-wider text-amber-400">
                    quirq × Nirvana
                  </span>{" "}
                  <span className="text-fd-muted-foreground">
                    — agent task management on bare metal
                  </span>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* 3-COLUMN RESEARCH GRID */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((n) => (
            <article
              key={n.url}
              className="group flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-all duration-300 hover:-translate-y-1 hover:border-fd-primary/40 hover:shadow-lg"
            >
              <Link href={n.url} className="flex h-full flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0c0e]">
                  <Image
                    src={n.imageUrl}
                    alt={n.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-fd-muted-foreground">
                    <span className="font-bold text-fd-primary">
                      {TRACKS[n.track].label}
                    </span>
                    <span>{n.num}</span>
                  </div>

                  <h3 className="mt-2.5 text-base font-bold leading-snug text-fd-foreground group-hover:text-fd-primary transition-colors">
                    {n.title}
                  </h3>

                  {n.description ? (
                    <p className="mt-2.5 text-xs leading-relaxed text-fd-muted-foreground line-clamp-3 flex-1">
                      {n.description}
                    </p>
                  ) : null}

                  <div className="mt-5 flex items-center justify-between border-t border-fd-border/50 pt-3 font-mono text-[10px] uppercase tracking-wider text-fd-muted-foreground">
                    <span>{n.date}</span>
                    <span className="flex items-center gap-1">
                      {n.readTime}
                      <span className="size-5 rounded-full border border-fd-border inline-flex items-center justify-center text-fd-foreground group-hover:border-fd-primary group-hover:text-fd-primary">
                        ↗
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
