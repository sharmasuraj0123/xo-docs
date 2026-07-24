import { notFound } from "next/navigation";
import { researchSource } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const page = researchSource.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  const processed = await page.data.getText("processed");

  return new Response(
    `# ${page.data.title} (${page.url})

${processed}`,
    {
      headers: {
        "Content-Type": "text/markdown",
      },
    },
  );
}

export function generateStaticParams() {
  return researchSource.getPages().map((page) => ({
    slug: [...page.slugs, "content.md"],
  }));
}
