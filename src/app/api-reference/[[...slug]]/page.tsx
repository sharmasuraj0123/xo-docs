import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { siteUrl } from "@/lib/shared";
import { apiSource } from "@/lib/source";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = apiSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const isIndex = !slug || slug.length === 0;

  if (isIndex) {
    return (
      <DocsPage toc={[]} full>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(apiSource, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton
          markdownUrl={`/api-reference/${(slug ?? []).join("/")}/content.md`}
        />
        <ViewOptionsPopover />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(apiSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return apiSource.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = apiSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
      url: `${siteUrl}${page.url}`,
    },
    twitter: {
      title: page.data.title,
      description: page.data.description,
    },
  };
}
