import type { Metadata } from "next";
import { QuirqHome } from "@/components/quirq-home";

export const metadata: Metadata = {
  title: "XO Space Docs",
  description:
    "Documentation for XO Space: the local control plane for AI coding agents. Run a Space locally or through XO Cloud.",
  alternates: {
    canonical: "https://docs.xo.builders/",
  },
  openGraph: {
    title: "XO Space Docs",
    description:
      "Documentation for XO Space: the local control plane for AI coding agents. Run a Space locally or through XO Cloud.",
    url: "https://docs.xo.builders/",
    type: "website",
  },
};

export default function RootPage() {
  return <QuirqHome />;
}
