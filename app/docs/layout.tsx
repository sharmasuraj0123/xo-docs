import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { source } from '@/lib/source';
import Image from 'next/image';

const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <Image src="/xologo.png" alt="XO" width={80} height={32} className="h-8 w-auto" />
    ),
  },
  links: [
    {
      text: 'xo.builders',
      url: 'https://xo.builders',
      active: 'nested-url',
    },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      tabMode="navbar"
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
