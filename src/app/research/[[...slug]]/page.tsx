import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { siteUrl } from "@/lib/shared";
import { researchSource } from "@/lib/source";
import { createRelativeLink } from "fumadocs-ui/mdx";

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

function ResearchListing() {
  const allPages = researchSource
    .getPages()
    .filter((p) => p.slugs.length > 0)
    .sort((a, b) => {
      const da = (a.data as { date?: string }).date ?? "";
      const db = (b.data as { date?: string }).date ?? "";
      return db.localeCompare(da);
    });

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-3">
            Research & Blog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground mb-3">
            Future of Work
          </h1>
          <p className="text-fd-muted-foreground text-base leading-relaxed">
            Perspectives, experiments, and thinking on AI-native work.
          </p>
        </div>

        <div className="divide-y divide-fd-border">
          {allPages.map((page) => {
            const data = page.data as {
              title: string;
              description?: string;
              tags?: string[];
              date?: string;
            };
            const date = formatDate(data.date);

            return (
              <Link
                key={page.url}
                href={page.url}
                className="group block py-7 hover:opacity-80 transition-opacity"
              >
                {data.tags && data.tags.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {data.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium tracking-wide uppercase text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-lg font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors mb-1.5">
                  {data.title}
                </h2>
                {data.description && (
                  <p className="text-sm text-fd-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {data.description}
                  </p>
                )}
                {date && (
                  <p className="text-xs text-fd-muted-foreground">{date}</p>
                )}
              </Link>
            );
          })}
        </div>
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
    toc: unknown[];
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

  return (
    <main className="min-h-screen">
      <article className="max-w-2xl mx-auto px-6 py-16">
        {data.tags && data.tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold tracking-widest uppercase text-fd-primary bg-fd-primary/10 px-2.5 py-1 rounded"
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
          </div>
        )}

        <div className="prose prose-fd max-w-none">
          <MDX
            components={
              getMDXComponents({
                a: createRelativeLink(researchSource, page),
              }) as Record<string, unknown>
            }
          />
        </div>

        <RelatedPosts currentUrl={page.url} tags={data.tags ?? []} />

        <div className="mt-16 pt-8 border-t border-fd-border">
          <Link
            href="/research"
            className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            ← All Research
          </Link>
        </div>
      </article>
    </main>
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
  };

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      url: `${siteUrl}${page.url}`,
    },
    twitter: {
      title: data.title,
      description: data.description,
    },
  };
}
