import type { BaseLayoutProps, LayoutTab } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { appName, gitConfig } from "./shared";
import { apiSource, researchSource, source, templatesSource } from "./source";

export function getNavTabs(): LayoutTab[] {
  return [
    {
      title: "Guides",
      url: "/docs",
      urls: new Set(source.getPages().map((p) => p.url)),
    },
    {
      title: "API Reference",
      url: "/api-reference",
      urls: new Set(apiSource.getPages().map((p) => p.url)),
    },
    {
      title: "Templates",
      url: "/templates",
      urls: new Set(templatesSource.getPages().map((p) => p.url)),
    },
    {
      title: "Research",
      url: "/research",
      urls: new Set(researchSource.getPages().map((p) => p.url)),
    },
  ];
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <Image
          src="/icons/logo.png"
          alt={appName}
          width={80}
          height={32}
          className="h-7 w-auto rounded-md"
          priority
        />
      ),
    },
    links: [
      {
        type: "icon",
        label: "GitHub",
        text: "GitHub",
        icon: <span className="icon-[ph--github-logo-fill] size-3.5" />,
        url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
        external: true,
      },
      {
        type: "icon",
        label: "xo.builders",
        text: "xo.builders",
        icon: <span className="icon-[ph--globe-fill] size-3.5" />,
        url: "https://xo.builders",
        external: true,
      },
      {
        type: "icon",
        label: "X (Twitter)",
        text: "X",
        icon: <span className="icon-[lineicons--x] size-3.5" />,
        url: "https://x.com/xo_builders",
        external: true,
      },
      {
        type: "icon",
        label: "Instagram",
        text: "Instagram",
        icon: <span className="icon-[ph--instagram-logo-fill] size-3.5" />,
        url: "https://www.instagram.com/xo_builders/",
        external: true,
      },
      {
        type: "icon",
        label: "LinkedIn",
        text: "LinkedIn",
        icon: <span className="icon-[ph--linkedin-logo-fill] size-3.5" />,
        url: "https://linkedin.com/company/xo-builders",
        external: true,
      },
      {
        type: "icon",
        label: "YouTube",
        text: "YouTube",
        icon: <span className="icon-[ph--youtube-logo-fill] size-3.5" />,
        url: "https://www.youtube.com/@xo_builders",
        external: true,
      },
    ],
  };
}
