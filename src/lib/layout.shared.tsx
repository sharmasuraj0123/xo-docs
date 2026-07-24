import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { appName, gitConfig } from "./shared";

const logo = (
  <>
    <Image
      src="/xo-light.svg"
      alt={appName}
      className="h-7 w-auto rounded-md block dark:hidden"
      width={500}
      height={500}
    />
    <Image
      src="/xo.svg"
      alt={appName}
      className="h-7 w-auto rounded-md hidden dark:block"
      width={500}
      height={500}
    />
  </>
);

const tabLinks: LinkItemType[] = [
  { text: "Guides", url: "/docs", active: "nested-url" },
  { text: "API Reference", url: "/api-reference", active: "nested-url" },
  { text: "Templates", url: "/templates", active: "nested-url" },
  { text: "Research", url: "/research", active: "nested-url" },
];

export const socialLinks: LinkItemType[] = [
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
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: logo },
    links: tabLinks,
  };
}
