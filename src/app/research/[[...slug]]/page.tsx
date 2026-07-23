import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOCItem } from "fumadocs-ui/components/toc/default";
import { TOCProvider, TOCScrollArea } from "fumadocs-ui/components/toc";
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { getMDXComponents } from "@/components/mdx";
import { siteUrl } from "@/lib/shared";
import { getResearchPageMarkdownUrl, researchSource } from "@/lib/source";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function RelatedPosts({
  currentUrl,
  tags,
}: {
  currentUrl: string;
  tags: string[];
}) {
  if (!tags || tags.length === 0) return null;

  const related = researchSource
    .getPages()
    .filter((p) => {
      if (p.url === currentUrl) return false;
      const pTags = (p.data as { tags?: string[] }).tags ?? [];
      return pTags.some((t) => tags.includes(t));
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-fd-border">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-8">
        Continue Reading
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {related.map((p) => {
          const d = p.data as {
            title: string;
            description?: string;
            date?: string;
            tags?: string[];
          };
          return (
            <Link
              key={p.url}
              href={p.url}
              className="group block p-4 rounded-lg border border-fd-border hover:border-fd-primary/50 hover:bg-fd-primary/5 transition-all"
            >
              {d.tags && d.tags.length > 0 && (
                <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary mb-2 block">
                  {d.tags[0]}
                </span>
              )}
              <h3 className="text-sm font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors leading-snug mb-1">
                {d.title}
              </h3>
              {d.date && (
                <p className="text-xs text-fd-muted-foreground mt-2">
                  {formatDate(d.date)}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PostNav({ currentUrl }: { currentUrl: string }) {
  const allPages = researchSource
    .getPages()
    .filter((p) => p.slugs.length > 0)
    .sort((a, b) => {
      const da = (a.data as { date?: string }).date ?? "";
      const db = (b.data as { date?: string }).date ?? "";
      return db.localeCompare(da);
    });

  const idx = allPages.findIndex((p) => p.url === currentUrl);
  const prev = idx > 0 ? allPages[idx - 1] : null;
  const next = idx < allPages.length - 1 ? allPages[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.url}
          className="group block p-4 rounded-lg border border-fd-border hover:border-fd-primary/50 hover:bg-fd-primary/5 transition-all text-left"
        >
          <p className="text-[10px] font-semibold tracking-widest uppercase text-fd-muted-foreground mb-2">
            ← Previous
          </p>
          <p className="text-sm font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors leading-snug">
            {(prev.data as { title: string }).title}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.url}
          className="group block p-4 rounded-lg border border-fd-border hover:border-fd-primary/50 hover:bg-fd-primary/5 transition-all text-right"
        >
          <p className="text-[10px] font-semibold tracking-widest uppercase text-fd-muted-foreground mb-2">
            Next →
          </p>
          <p className="text-sm font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors leading-snug">
            {(next.data as { title: string }).title}
          </p>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

function TagCloud() {
  const counts = new Map<string, number>();
  let total = 0;

  for (const page of researchSource.getPages()) {
    const tags = (page.data as { tags?: string[] }).tags ?? [];
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    if (tags.length > 0) total++;
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  if (sorted.length === 0) return null;

  const maxCount = sorted[0][1];

  return (
    <div className="mb-14 text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {sorted.map(([tag, count]) => {
          const weight = 0.7 + (count / maxCount) * 0.6;
          return (
            <Link
              key={tag}
              href={`/research/category/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 text-sm text-fd-muted-foreground hover:text-fd-primary hover:border-fd-primary/40 transition-all"
              style={{ fontSize: `${0.75 + (weight - 0.7) * 0.25}rem` }}
            >
              {tag}
              <span className="text-[10px] text-fd-muted-foreground/60">
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ResearchCard({
  page,
}: {
  page: ReturnType<typeof researchSource.getPages>[number];
}) {
  const data = page.data as {
    title: string;
    description?: string;
    tags?: string[];
    date?: string;
  };
  const date = formatDate(data.date);
  const category = data.tags?.[0];

  return (
    <Link
      href={page.url}
      className="group relative flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 hover:border-fd-primary/40 hover:shadow-lg hover:shadow-fd-primary/5 transition-all"
    >
      {category && (
        <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary mb-3">
          {category}
        </span>
      )}
      <h2 className="text-base font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors mb-2 leading-snug">
        {data.title}
      </h2>
      {data.description && (
        <p className="text-sm text-fd-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
          {data.description}
        </p>
      )}
      {date && (
        <p className="text-xs text-fd-muted-foreground mt-auto pt-3 border-t border-fd-border/50">
          {date}
        </p>
      )}
    </Link>
  );
}

const isQuirq = (slug: string[]) =>
  slug.length > 1 &&
  slug[0] === "phase-1-agentic-workforce" &&
  (slug[1] === "quirq" || slug[1] === "unit-of-work-research");

function orderFromTree(): Map<string, number> {
  const order = new Map<string, number>();
  let idx = 0;
  function walk(node: { $ref?: string; children?: unknown[] }) {
    if (node.$ref) order.set(node.$ref, idx++);
    if (node.children)
      for (const child of node.children) walk(child as typeof node);
  }
  walk(
    researchSource.pageTree as typeof walk extends (arg: infer T) => void
      ? T
      : never,
  );
  return order;
}

function ResearchListing() {
  const rootData = researchSource.getPage([])?.data as
    | {
        title?: string;
        description?: string;
      }
    | undefined;

  const treeOrder = orderFromTree();

  const allPages = researchSource
    .getPages()
    .filter((p) => p.slugs.length > 0)
    .sort((a, b) => {
      const oa = treeOrder.get(a.slugs.join("/")) ?? 999;
      const ob = treeOrder.get(b.slugs.join("/")) ?? 999;
      if (oa !== ob) return oa - ob;
      const da = (a.data as { date?: string }).date ?? "";
      const db = (b.data as { date?: string }).date ?? "";
      return db.localeCompare(da);
    });

  const fowPages = allPages.filter((p) => !isQuirq(p.slugs));
  const quirqPages = allPages.filter((p) => isQuirq(p.slugs));

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-3">
            Research
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-fd-foreground mb-4">
            Future of Work
          </h1>
          <p className="text-fd-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
            Perspectives, experiments, and thinking on AI-native work.
          </p>
        </div>

        <TagCloud />

        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground">
              The Future of Work
            </h2>
            <span className="flex-1 h-px bg-fd-border/50" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fowPages.map((page) => (
              <ResearchCard key={page.url} page={page} />
            ))}
          </div>
        </div>

        {quirqPages.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground">
                quirq: A Unit of Work for Intelligence
              </h2>
              <span className="flex-1 h-px bg-fd-border/50" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quirqPages.map((page) => (
                <ResearchCard key={page.url} page={page} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return <ResearchListing />;
  }

  const page = researchSource.getPage(slug);
  if (!page) notFound();

  const data = page.data as {
    title: string;
    description?: string;
    tags?: string[];
    date?: string;
    toc: { title: string; url: string; depth: number }[];
    body: React.ComponentType<{ components: Record<string, unknown> }>;
    getText: (type: string) => Promise<string>;
  };

  const MDX = data.body;
  const date = formatDate(data.date);
  const processedText =
    typeof data.getText === "function"
      ? await data.getText("processed").catch(() => "")
      : "";
  const minutes = processedText ? readingTime(processedText) : null;
  const markdownUrl = getResearchPageMarkdownUrl(page).url;

  return (
    <TOCProvider toc={data.toc}>
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-16">
        <div className="flex gap-12">
          <aside className="w-56 shrink-0 hidden xl:block self-start sticky top-24">
            {data.toc.length > 0 && (
              <>
                <p className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-4">
                  On this page
                </p>
                <TOCScrollArea>
                  <div className="flex flex-col border-s border-fd-foreground/10">
                    {data.toc.map((item) => (
                      <TOCItem key={item.url} item={item} />
                    ))}
                  </div>
                </TOCScrollArea>
              </>
            )}
          </aside>

          <article className="min-w-0 flex-1 max-w-[42rem]">
            <Link
              href="/research"
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-8 inline-block"
            >
              ← All Posts
            </Link>

            {/* <div className="flex flex-col gap-4 text-sm mb-8">
              {date && (
                <div>
                  <p className="text-fd-muted-foreground">Written by</p>
                  <p className="font-medium">XO Team</p>
                </div>
              )}
              <div>
                <p className="text-fd-muted-foreground">At</p>
                <p className="font-medium">{date}</p>
              </div>
            </div> */}

            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {data.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium tracking-wide uppercase text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground mb-4 leading-tight">
              {data.title}
            </h1>

            {data.description && (
              <p className="text-base text-fd-muted-foreground leading-relaxed mb-6">
                {data.description}
              </p>
            )}

            {(date || minutes) && (
              <div className="flex items-center gap-3 text-sm text-fd-muted-foreground mb-10 pb-10 border-b border-fd-border">
                {date && <span>{date}</span>}
                {date && minutes && <span>·</span>}
                {minutes && <span>{minutes} min read</span>}
                <span className="ml-auto flex items-center gap-2">
                  <MarkdownCopyButton markdownUrl={markdownUrl} />
                  <ViewOptionsPopover />
                </span>
              </div>
            )}

            <div className="prose min-w-0">
              <MDX components={getMDXComponents() as Record<string, unknown>} />
            </div>

            <div className="mt-16 pt-8 border-t border-fd-border">
              <PostNav currentUrl={page.url} />
            </div>

            <RelatedPosts currentUrl={page.url} tags={data.tags ?? []} />
          </article>
        </div>
      </div>
    </TOCProvider>
  );
}

export async function generateStaticParams() {
  return researchSource.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: "Research",
      description:
        "Perspectives, experiments, and thinking on the future of work with AI.",
    };
  }

  const page = researchSource.getPage(slug);
  if (!page) notFound();

  const data = page.data as {
    title: string;
    description?: string;
    tags?: string[];
    date?: string;
  };

  const keywords = data.tags ?? [];

  return {
    title: data.title,
    description: data.description,
    keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      url: `${siteUrl}${page.url}`,
      ...(data.date && { publishedTime: data.date }),
    },
    twitter: {
      title: data.title,
      description: data.description,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        ...(data.date && { datePublished: data.date }),
        ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
        author: { "@type": "Organization", name: "XO Team" },
        url: `${siteUrl}${page.url}`,
      }),
    },
  };
}
