import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={raleway.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
