import Link from 'next/link';
import Image from 'next/image';

const products = [
  {
    title: 'XO Vibe',
    desc: 'AI-native browser-based app builder. Describe what you want, watch it get built.',
    href: '/docs/xo-vibe',
    icon: '⚡',
  },
  {
    title: 'XO Launchpad',
    desc: 'One-click container deployment. From local build to live URL in minutes.',
    href: '/docs/xo-launchpad',
    icon: '🚀',
  },
  {
    title: 'XO MCP Server',
    desc: 'Connect XO to Cursor, Claude, Devin, ChatGPT, and more via MCP.',
    href: '/docs/xo-mcp-server',
    icon: '🔌',
  },
  {
    title: 'XO Swarm',
    desc: 'Deploy and manage multi-agent AI systems with persistent knowledge bases.',
    href: '/docs/xo-swarm',
    icon: '🧠',
  },
];

const quickLinks = [
  { title: 'Quickstart', desc: 'Get your first app running', href: '/docs/xo-vibe/quickstart' },
  { title: 'Deploy from GitHub', desc: 'Push a repo to XO Launchpad', href: '/docs/xo-launchpad/no-code-deployment/deploying-from-github-repository' },
  { title: 'OpenClaw Setup', desc: 'Deploy your AI agent gateway', href: '/docs/xo-swarm/openclaw' },
  { title: 'MCP Setup', desc: 'Connect your IDE to XO', href: '/docs/xo-mcp-server/setup' },
  { title: 'Templates', desc: 'Pre-built deployment templates', href: '/docs/xo-launchpad/templates' },
  { title: 'Support', desc: 'Get help from our GPT', href: '/docs/xo-support-hub' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      {/* Hero */}
      <div className="flex flex-col items-center pt-24 pb-16 px-4 text-center">
        <Image src="/xologo.png" alt="XO" width={480} height={192} className="h-44 w-auto mb-6" />
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          Documentation
        </h1>
        <p className="text-[#a1a1aa] text-lg max-w-md leading-relaxed mb-8">
          Everything you need to build, deploy, and scale with XO.
        </p>
        <div className="flex gap-3">
          <Link
            href="/docs"
            className="bg-[#83d63a] text-[#09090b] font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#96e04f] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="https://xo.builders"
            target="_blank"
            className="border border-[#27272a] text-[#fafafa] font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#18181b] transition-colors"
          >
            xo.builders
          </Link>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#a1a1aa] mb-4 px-1">
          Explore by product
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group border border-[#27272a] rounded-xl p-5 bg-[#111113] hover:bg-[#18181b] hover:border-[#3f3f46] transition-all"
            >
              <div className="text-2xl mb-3">{p.icon}</div>
              <div className="font-semibold text-white mb-1 group-hover:text-[#83d63a] transition-colors">
                {p.title}
              </div>
              <div className="text-sm text-[#a1a1aa] leading-relaxed">
                {p.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#a1a1aa] mb-4 px-1">
          Popular guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group border border-[#27272a] rounded-xl px-5 py-4 hover:bg-[#111113] hover:border-[#3f3f46] transition-all"
            >
              <div className="font-medium text-sm text-white group-hover:text-[#83d63a] transition-colors">
                {q.title}
              </div>
              <div className="text-sm text-[#71717a] mt-0.5">
                {q.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
