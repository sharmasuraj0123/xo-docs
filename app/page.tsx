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
  { title: 'OpenClaw Setup', href: '/docs/xo-workspaces/openclaw', icon: Bot },
  { title: 'MCP Setup', href: '/docs/xo-mcp-server/setup', icon: Settings },
  { title: 'Templates', href: '/docs/xo-launchpad/templates', icon: LayoutTemplate },
  { title: 'Support', href: '/docs/xo-support-hub', icon: LifeBuoy },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center px-4 pt-16 pb-20">
      {/* Hero */}
      <Image src="/xologo.png" alt="XO" width={320} height={128} className="h-20 w-auto mb-6" />
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
        Documentation
      </h1>
      <p className="text-[#71717a] text-sm max-w-xs text-center leading-relaxed mb-8">
        Everything you need to build, deploy, and scale with XO.
      </p>
      <div className="flex gap-3 mb-16">
        <Link
          href="/docs"
          className="bg-[#83d63a] text-[#09090b] font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#96e04f] transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="https://xo.builders"
          target="_blank"
          className="border border-[#27272a] text-[#a1a1aa] font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#111113] hover:text-white transition-colors"
        >
          xo.builders →
        </Link>
      </div>

      {/* Products */}
      <div className="w-full max-w-3xl mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3f3f46] mb-4 px-1">
          Products
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative border border-[#27272a] rounded-xl p-5 bg-[#111113] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#83d63a]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-3 p-2 rounded-lg border border-[#27272a] bg-[#0d0d0f] w-fit group-hover:border-[#3f3f46] transition-colors">
                <p.icon size={18} className="text-[#83d63a]" />
              </div>
              <div className="font-semibold text-sm text-white mb-1 group-hover:text-[#83d63a] transition-colors">
                {p.title}
              </div>
              <div className="text-xs text-[#71717a] leading-relaxed">
                {p.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="w-full max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3f3f46] mb-4 px-1">
          Popular guides
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-center gap-3 border border-[#27272a] rounded-xl px-4 py-3.5 bg-[#111113] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all"
            >
              <q.icon size={14} className="text-[#52525b] group-hover:text-[#83d63a] transition-colors shrink-0" />
              <span className="font-medium text-sm text-[#a1a1aa] group-hover:text-white transition-colors">
                {q.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
