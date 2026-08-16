import type { Metadata } from "next";
import { QuirqHome } from "@/components/quirq-home";

export const metadata: Metadata = {
  title: "Quirq Docs",
  description:
    "Build and run agentic work. Run a Space locally or through XO in the cloud, then measure delivered work with quirqs.",
  alternates: {
    canonical: "https://docs.quirq.ai/",
  },
  openGraph: {
    title: "Quirq Docs",
    description:
      "Build and run agentic work. Run a Space locally or through XO in the cloud, then measure delivered work with quirqs.",
    url: "https://docs.quirq.ai/",
    type: "website",
  },
};

export default function RootPage() {
  return <QuirqHome />;
}
