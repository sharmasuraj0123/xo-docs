import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { researchSource } from "@/lib/source";

interface Props {
  params: Promise<{ tag: string }>;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CategoryPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const pages = researchSource
    .getPages()
    .filter((p) => {
      if (p.slugs.length === 0) return false;
      const tags = (p.data as { tags?: string[] }).tags ?? [];
      return tags.some(
        (t) =>
          t.toLowerCase().replace(/\s+/g, "-") ===
          decoded.toLowerCase().replace(/\s+/g, "-"),
      );
    })
    .sort((a, b) => {
      const da = (a.data as { date?: string }).date ?? "";
      const db = (b.data as { date?: string }).date ?? "";
      return db.localeCompare(da);
    });

  if (pages.length === 0) notFound();

  const displayTag =
    (pages[0].data as { tags?: string[] }).tags?.find(
      (t) =>
        t.toLowerCase().replace(/\s+/g, "-") ===
        decoded.toLowerCase().replace(/\s+/g, "-"),
    ) ?? decoded;

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link
          href="/research"
          className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors mb-8 inline-block"
        >
          ← All Research
        </Link>

        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-3">
            Category
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground">
            {displayTag}
          </h1>
          <p className="text-fd-muted-foreground text-sm mt-2">
            {pages.length} {pages.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
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
                className="group relative flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 hover:border-fd-primary/40 hover:shadow-lg hover:shadow-fd-primary/5 transition-all"
              >
                {data.title && (
                  <h2 className="text-base font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors mb-2 leading-snug">
                    {data.title}
                  </h2>
                )}
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
          })}
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  const tagSet = new Set<string>();

  for (const page of researchSource.getPages()) {
    const tags = (page.data as { tags?: string[] }).tags ?? [];
    for (const tag of tags) {
      tagSet.add(tag.toLowerCase().replace(/\s+/g, "-"));
    }
  }

  return Array.from(tagSet).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  return {
    title: `${decoded} — Research`,
    description: `Browse all research posts tagged with "${decoded}".`,
  };
}
