import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions, getNavTabs } from "@/lib/layout.shared";
import { researchSource } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      sidebar={{ enabled: false }}
      tabs={getNavTabs()}
      tabMode="top"
      tree={researchSource.getPageTree()}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
