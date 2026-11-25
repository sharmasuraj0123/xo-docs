import {
  ImageZoom,
  type ImageZoomProps,
} from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { BrandIcon } from "./brand-icon";
import { Card, Cards } from "./card";
import * as Figure from "./figure";
import * as Fow from "./fow";
import * as SpaceObservability from "./space-observability";
import { VideoEmbed } from "./video-embed";
import { WhatIsXO } from "./what-is-xo";

// Screenshots are served as the original PNG (2560 x 1600): Next's image optimizer would re-encode them
// as lossy WebP at a smaller width and blur the app's text. Fumadocs hands these props to next/image,
// whose `unoptimized` its own ImageProps type does not list.
const ORIGINAL = { unoptimized: true };

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // A click opens the image full size.
    img: (props) => <ImageZoom {...(props as ImageZoomProps)} {...ORIGINAL} />,
    BrandIcon,
    Card,
    Cards,
    VideoEmbed,
    WhatIsXO,
    ...Fow,
    ...Figure,
    ...SpaceObservability,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
