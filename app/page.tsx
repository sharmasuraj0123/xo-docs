import Link from 'next/link';
import Image from 'next/image';
import { Rocket, Plug2, Network, Github, Bot, Settings, LayoutTemplate, LifeBuoy, HardDrive } from 'lucide-react';
import type { ComponentType } from 'react';

const products: { title: string; desc: string; href: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  {
    title: 'XO Launchpad',
    desc: 'One-click deploy. Local to live in minutes.',
    href: '/docs/xo-launchpad',
    icon: Rocket,
  },
  {
    title: 'XO MCP Server',
    desc: 'Connect Cursor, Claude, Devin, and more.',
    href: '/docs/xo-mcp-server',
    icon: Plug2,
  },
  {
    title: 'XO Workspaces',
    desc: 'AI agent workspaces with shared memory.',
    href: '/docs/xo-workspaces',
    icon: Network,
  },
];

const quickLinks: { title: string; href: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { title: 'Deploy from GitHub', href: '/docs/xo-launchpad/no-code-deployment/deploying-from-github-repository', icon: Github },
  { title: 'Deploy from Local', href: '/docs/xo-launchpad/no-code-deployment/deploying-from-local', icon: HardDrive },
  { title: 'OpenClaw Setup', href: '/docs/xo-workspaces/agents/openclaw', icon: Bot },
  { title: 'MCP Setup', href: '/docs/xo-mcp-server/setup', icon: Settings },
  { title: 'Templates', href: '/docs/xo-launchpad/templates', icon: LayoutTemplate },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-fd-background flex flex-col items-center px-4 pt-16 pb-20">
      {/* Hero */}
      <Image src="/xologo.png" alt="XO" width={320} height={128} className="h-20 w-auto mb-6" />
      <h1 className="text-3xl font-bold text-fd-foreground tracking-tight mb-2">
        Documentation
      </h1>
      <p className="text-fd-muted-foreground text-sm max-w-xs text-center leading-relaxed mb-8">
        Everything you need to build, deploy, and scale with XO.
      </p>
      <div className="flex gap-3 mb-16">
        <Link
          href="/docs"
          className="bg-fd-primary text-fd-primary-foreground font-semibold px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="https://xo.builders"
          target="_blank"
          className="border border-fd-border text-fd-muted-foreground font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-fd-muted hover:text-fd-foreground transition-colors"
        >
          xo.builders →
        </Link>
      </div>

      {/* Products */}
      <div className="w-full max-w-3xl mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground mb-4 px-1">
          Products
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative border border-fd-border rounded-xl p-5 bg-fd-card hover:bg-fd-muted hover:border-fd-muted-foreground/20 transition-all overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fd-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-3 p-2 rounded-lg border border-fd-border bg-fd-background w-fit group-hover:border-fd-muted-foreground/20 transition-colors">
                <p.icon size={18} className="text-fd-primary" />
              </div>
              <div className="font-semibold text-sm text-fd-foreground mb-1 group-hover:text-fd-primary transition-colors">
                {p.title}
              </div>
              <div className="text-xs text-fd-muted-foreground leading-relaxed">
                {p.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="w-full max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground mb-4 px-1">
          Popular guides
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-center gap-3 border border-fd-border rounded-xl px-4 py-3.5 bg-fd-card hover:bg-fd-muted hover:border-fd-muted-foreground/20 transition-all"
            >
              <q.icon size={14} className="text-fd-muted-foreground group-hover:text-fd-primary transition-colors shrink-0" />
              <span className="font-medium text-sm text-fd-muted-foreground group-hover:text-fd-foreground transition-colors">
                {q.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
