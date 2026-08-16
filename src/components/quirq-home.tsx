import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { ShaderBackground } from "@/components/hero-shader";
import { SystemSequence } from "@/components/system-sequence";
import { socialLinks } from "@/lib/layout.shared";

export function QuirqHome() {
  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <BrandIcon name="quirq" size={24} />
          <span>quirq</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
          <Link
            href="/docs"
            className="text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Documentation
          </Link>
          <a
            href="https://app.xo.builders/sign-up?ref=docs.quirq.ai"
            className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
          >
            Start with XO
          </a>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden border-y border-fd-border bg-fd-muted/30 px-5 py-24 sm:px-8 sm:py-32">
        <ShaderBackground opacity={0.16} />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-fd-muted-foreground">
            Agentic work, made legible
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
            Build and run agentic work.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-fd-muted-foreground sm:text-lg">
            A Space is the environment where your agent works. Run it locally or
            through XO in the cloud. quirqs measure the work delivered.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/space/install-space"
              className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="icon-[ph--monitor-fill] mr-2 inline-block size-4 align-[-0.125em]" />
              Start a local Space
            </Link>
            <a
              href="https://app.xo.builders/sign-up?ref=docs.quirq.ai"
              className="rounded-lg border border-fd-border bg-fd-background/80 px-6 py-3 text-sm font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="icon-[ph--rocket-fill] mr-2 inline-block size-4 align-[-0.125em] text-fd-primary" />
              Run a Space in the cloud
            </a>
          </div>
        </div>
      </section>

      <SystemSequence />

      <section className="border-y border-fd-border bg-fd-muted px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
            One Space. Any runtime.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="group relative isolate min-h-[32rem] overflow-hidden rounded-2xl border border-fd-border bg-[#05080c] p-7 text-white sm:p-10">
              <Image
                src="/images/system-local.png"
                alt="A local Space running on a personal machine"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-contain object-right-bottom p-3 opacity-85 transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,8,12,0.98)_0%,rgba(5,8,12,0.82)_35%,rgba(5,8,12,0.15)_75%,rgba(5,8,12,0.02)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05080c] via-[#05080c]/40 to-transparent" />
              <div className="relative flex h-full max-w-sm flex-col items-start">
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-fd-primary">
                  <span className="icon-[ph--monitor-fill] size-5" />
                </span>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-fd-primary">
                    Local runtime
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                    Your machine.
                  </h2>
                  <p className="mt-3 leading-7 text-white/70">
                    Install and run a Space where you work today.
                  </p>
                  <Link
                    href="/docs/space/install-space"
                    className="mt-7 inline-flex items-center rounded-lg bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
                  >
                    Start a local Space
                    <span className="icon-[ph--arrow-right-bold] ml-2 size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="group relative isolate min-h-[32rem] overflow-hidden rounded-2xl border border-fd-border bg-[#05080c] p-7 text-white sm:p-10">
              <Image
                src="/images/system-cloud.png"
                alt="A Space running across connected cloud infrastructure"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-contain object-right-bottom p-3 opacity-85 transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,8,12,0.98)_0%,rgba(5,8,12,0.82)_35%,rgba(5,8,12,0.15)_75%,rgba(5,8,12,0.02)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05080c] via-[#05080c]/40 to-transparent" />
              <div className="relative flex h-full max-w-sm flex-col items-start">
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-fd-primary">
                  <span className="icon-[ph--rocket-fill] size-5" />
                </span>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-fd-primary">
                    Cloud runtime
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                    XO in the cloud.
                  </h2>
                  <p className="mt-3 leading-7 text-white/70">
                    Run the same Space through XO without managing the runtime
                    yourself.
                  </p>
                  <a
                    href="https://app.xo.builders/sign-up?ref=docs.quirq.ai"
                    className="mt-7 inline-flex items-center rounded-lg bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
                  >
                    Start with XO
                    <span className="icon-[ph--arrow-right-bold] ml-2 size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              The terms that matter
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Space is the environment. quirqs measure the work.
            </h2>
          </div>
          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Space</dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                The environment where an agent runs and work gets done.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Runtime</dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                The local machine or XO cloud infrastructure hosting the Space.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Agent</dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                The model harness that performs work inside the Space.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">quirqs</dt>
              <dd className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                The measure of verified, delivered work—not the environment
                itself.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-t border-fd-border px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
            Explore the docs
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/docs/space/install-space"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--monitor-fill] size-4" />
              </span>
              <span className="font-semibold">Install Space</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                Run locally.
              </span>
            </Link>
            <Link
              href="/docs/space/install-space-as-a-skill/claude-code"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--terminal-window-fill] size-4" />
              </span>
              <span className="font-semibold">Use Claude Code</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                Install with a skill.
              </span>
            </Link>
            <Link
              href="/docs/quirq"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--gauge-fill] size-4" />
              </span>
              <span className="font-semibold">Measure work</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                Learn about quirqs.
              </span>
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
            >
              <span className="mb-3 flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-muted text-fd-primary">
                <span className="icon-[ph--book-open-fill] size-4" />
              </span>
              <span className="font-semibold">All documentation</span>
              <span className="mt-2 block text-sm text-fd-muted-foreground">
                Browse every guide.
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-fd-border bg-fd-muted/30 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Measure what agentic work delivers.</p>
          <nav aria-label="Social links" className="flex items-center gap-2">
            {socialLinks.map((link) => {
              if (link.type !== "icon") return null;

              return (
                <a
                  key={link.label}
                  href={link.url}
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-primary"
                >
                  {link.icon}
                </a>
              );
            })}
          </nav>
        </div>
      </footer>
    </main>
  );
}
