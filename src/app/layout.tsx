import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { GoogleAnalyticsProvider } from "@/components/google-analytics";
import { PostHogPageView, PostHogProvider } from "@/components/posthog";
import { appName, siteUrl } from "@/lib/shared";

// Canopy type: Figtree for reading, Bricolage Grotesque (with its width
// axis, so headings can be set slightly condensed) for display, JetBrains
// Mono for code and the small hex labels. global.css maps them to
// --font-sans, --font-display and --font-mono.
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Documentation for XO — deploy apps, connect AI agents, and scale with XO Launchpad, XO MCP Server, and XO Spaces.",
  openGraph: {
    siteName: appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${bricolage.variable} ${jetbrainsMono.variable} ${figtree.className}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {/* Follow the OS by default; a picked theme is written to <html> as
            class="dark" for Fumadocs and data-theme for the quirq convention.
            The Canopy voice is quiet and growing, so empty states say so. */}
        <RootProvider
          theme={{
            attribute: ["class", "data-theme"],
            defaultTheme: "system",
            enableSystem: true,
          }}
          i18n={{
            translations: {
              searchNoResult: "Nothing growing here yet.",
              tocNoHeadings: "Nothing growing here yet.",
            },
          }}
        >
          <GoogleAnalyticsProvider />
          <PostHogProvider>
            <PostHogPageView />
            {children}
          </PostHogProvider>
        </RootProvider>
      </body>
    </html>
  );
}
