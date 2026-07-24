import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
    >
      {children}
    </HomeLayout>
  );
}
