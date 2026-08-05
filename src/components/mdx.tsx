import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { BrandIcon } from "./brand-icon";
import { Card, Cards } from "./card";
import * as Fow from "./fow";
import { WhatIsXO } from "./what-is-xo";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    BrandIcon,
    Card,
    Cards,
    WhatIsXO,
    ...Fow,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
