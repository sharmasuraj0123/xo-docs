import { loader } from 'fumadocs-core/source';
import { createMDXSource, resolveFiles } from 'fumadocs-mdx';
import { docs, meta } from '@/.source';
import { createElement, type ComponentType } from 'react';
import * as LucideIcons from 'lucide-react';

const typed = createMDXSource(docs, meta);

export const source = loader({
  baseUrl: '/docs',
  icon(icon) {
    if (!icon) return;
    const Icon = LucideIcons[icon as keyof typeof LucideIcons] as
      | ComponentType<{ size?: number; className?: string }>
      | undefined;
    if (Icon) return createElement(Icon, { size: 16 });
  },
  source: {
    files: resolveFiles({ docs, meta }),
  } as typeof typed,
});
