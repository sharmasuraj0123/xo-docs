import { TOCProvider, TOCScrollArea } from "fumadocs-ui/components/toc";
import { TOCItem } from "fumadocs-ui/components/toc/default";
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { ResearchHub, type ResearchPageItem } from "@/components/research-hub";
import { siteUrl } from "@/lib/shared";
import {
  getResearchPageImage,
  getResearchPageMarkdownUrl,
  researchSource,
} from "@/lib/source";

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

function getTrack(
  slugs: string[],
  tags: string[],
): "speed-trials" | "from-the-desk" | "proving-grounds" {
  if (tags.includes("speed-trials") || slugs[0] === "experiments") {
    return "speed-trials";
  }
  if (tags.includes("from-the-desk") || slugs[0] === "perspectives") {
    return "from-the-desk";
  }
  if (slugs[0]?.startsWith("phase-") || tags.includes("proving-grounds")) {
    return "proving-grounds";
  }
  return "speed-trials";
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

  const items: ResearchPageItem[] = allPages.map((page, idx) => {
    const data = page.data as {
      title: string;
      description?: string;
      tags?: string[];
      date?: string;
    };
    const tags = data.tags ?? [];
    const track = getTrack(page.slugs, tags);
    const dateFormatted = data.date ? (formatDate(data.date) ?? data.date) : "";
    const num = String(idx + 1).padStart(2, "0");
    const thumb = getResearchPageImage(page);

    return {
      url: page.url,
      slugs: page.slugs,
      title: data.title,
      description: data.description,
      date: dateFormatted,
      tags,
      imageUrl: thumb.url,
      track,
      num,
      readTime: "5 min read",
    };
  });

  return <ResearchHub items={items} />;
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
    singleFont?: boolean;
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

          <article
            className="min-w-0 flex-1 max-w-[42rem]"
            data-single-font={data.singleFont ? "" : undefined}
          >
            <Link
              href="/research"
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-8 inline-block"
            >
              ← All Posts
            </Link>

            <div className="w-full aspect-video rounded-xl overflow-hidden mb-8">
              <Image
                src={getResearchPageImage(page).url}
                alt=""
                width={1200}
                height={630}
                className="w-full h-full object-cover"
              />
            </div>

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
      images: [`${siteUrl}${getResearchPageImage(page).url}`],
      ...(data.date && { publishedTime: data.date }),
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [`${siteUrl}${getResearchPageImage(page).url}`],
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
