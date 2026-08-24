import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  async redirects() {
    return [
      {
        source: "/future-of-work/:path*",
        destination: "/research/:path*",
        permanent: true,
      },
      {
        source: "/agents/:path*",
        destination: "/docs/agents/:path*",
        permanent: true,
      },
      {
        source: "/getting-started",
        destination: "/docs/cloud",
        permanent: true,
      },
      {
        source: "/docs/getting-started",
        destination: "/docs/cloud",
        permanent: true,
      },
      {
        source: "/docs/getting-started/:path*",
        destination: "/docs/cloud/:path*",
        permanent: true,
      },
      {
        source: "/docs/cloud/core-concepts",
        destination: "/docs/glossary",
        permanent: true,
      },
      // Temporary: undo Space-core IA URLs after revert to peer Cloud/Space docs
      {
        source: "/docs/what-is-a-space",
        destination: "/docs/glossary",
        permanent: false,
      },
      {
        source: "/docs/get-a-space",
        destination: "/docs/cloud",
        permanent: false,
      },
      {
        source: "/docs/get-a-space/on-cloud",
        destination: "/docs/cloud",
        permanent: false,
      },
      {
        source: "/docs/get-a-space/on-cloud/:path*",
        destination: "/docs/cloud/:path*",
        permanent: false,
      },
      {
        source: "/docs/get-a-space/on-your-machine",
        destination: "/docs/space",
        permanent: false,
      },
      {
        source: "/docs/get-a-space/on-your-machine/:path*",
        destination: "/docs/space/:path*",
        permanent: false,
      },
      {
        source: "/docs/use-your-space",
        destination: "/docs/agents",
        permanent: false,
      },
      {
        source: "/docs/use-your-space/browser-ide",
        destination: "/docs/cloud/vs-code-server",
        permanent: false,
      },
      {
        source: "/docs/cloud-platform",
        destination: "/docs/cloud",
        permanent: false,
      },
      {
        source: "/docs/cloud-platform/manage-machine",
        destination: "/docs/cloud/manage-workspace",
        permanent: false,
      },
      {
        source: "/docs/cloud-platform/share-project",
        destination: "/docs/cloud/share-project",
        permanent: false,
      },
      {
        source: "/more/create-your-alter-ego/:path*",
        destination: "/more/create-your-environments/:path*",
        permanent: true,
      },
      {
        source: "/docs/more/xo-cowork-api/:path*",
        destination: "/api-reference/:path*",
        permanent: true,
      },
      {
        source: "/more/xo-cowork-api/:path*",
        destination: "/api-reference/:path*",
        permanent: true,
      },
      {
        source: "/more/xo-mcp-server/:path*",
        destination: "/api-reference/xo-mcp-server/:path*",
        permanent: true,
      },
      {
        source: "/docs/more/xo-mcp-server/:path*",
        destination: "/api-reference/xo-mcp-server/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
    ];
  },
};

export default withMDX(config);
