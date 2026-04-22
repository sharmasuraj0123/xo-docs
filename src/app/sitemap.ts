import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { siteUrl } from "@/lib/shared";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.slugs.length === 0 ? 1 : 0.8,
  }));
}
