import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
} from "@/components/ai/search";
import { cn } from "@/lib/cn";
import { baseOptions, socialLinks } from "@/lib/layout.shared";
import { apiSource } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebarLinks: LinkItemType[] = socialLinks.map((l) => ({
    ...l,
    on: "menu" as const,
  }));

  return (
    <HomeLayout {...baseOptions()}>
      <DocsLayout
        tree={apiSource.getPageTree()}
        nav={{ enabled: false }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        links={sidebarLinks}
      >
        <AISearch>
          <AISearchPanel />
          <AISearchTrigger
            position="float"
            className={cn(
              buttonVariants({
                variant: "secondary",
                className: "text-fd-muted-foreground rounded-2xl",
              }),
            )}
          >
            <span className="icon-[ph--chat-circle] size-4.5" />
            Ask AI
          </AISearchTrigger>
        </AISearch>

        {children}
      </DocsLayout>
    </HomeLayout>
  );
}
