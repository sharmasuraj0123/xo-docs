import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getResearchPageImage, researchSource } from "@/lib/source";

export const revalidate = false;

// 8 distinct palettes: [base, midColor, accentColor, highlightColor]
const PALETTES: [string, string, string, string][] = [
  ["#1a0a2e", "#4c1d95", "#7c3aed", "#a78bfa"], // violet
  ["#0c1a2e", "#0e3a6e", "#1d6bb8", "#60a5fa"], // ocean blue
  ["#1a0c0c", "#7f1d1d", "#c0392b", "#f87171"], // deep red
  ["#0a1a12", "#064e3b", "#059669", "#34d399"], // emerald
  ["#1a120a", "#78350f", "#c2691d", "#fbbf24"], // amber
  ["#0e0a1e", "#312e81", "#4338ca", "#818cf8"], // indigo
  ["#1a0a14", "#831843", "#be185d", "#f472b6"], // rose
  ["#0a1a1a", "#134e4a", "#0d9488", "#2dd4bf"], // teal
];

function slugHash(s: string): number {
  let h = 0;
  for (const c of s) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function noiseDataUri(seed: number): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">` +
    `<filter id="n">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="0"/>` +
    `</filter>` +
    `<rect width="100%" height="100%" filter="url(#n)" opacity="1"/>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = researchSource.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const data = page.data as {
    title: string;
    tags?: string[];
    date?: string;
  };

  const hash = slugHash(slug.join("/"));
  const [base, mid, accent, highlight] = PALETTES[hash % PALETTES.length];
  const noiseSeed = hash % 999;
  const noise = noiseDataUri(noiseSeed);

  // Radial highlight position varies per article
  const rx = 20 + (hash % 60);
  const ry = 10 + (hash % 55);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        position: "relative",
        background: `linear-gradient(145deg, ${base} 0%, ${mid} 55%, ${base} 100%)`,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* primary radial glow — slug-positioned */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 70% at ${rx}% ${ry}%, ${accent}55 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* secondary accent glow — opposite corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 50% 50% at ${100 - rx}% ${100 - ry}%, ${mid}88 0%, transparent 60%)`,
          display: "flex",
        }}
      />

      {/* noise grain — high opacity for visible texture */}
      {/* biome-ignore lint/performance/noImgElement: next/image unavailable inside ImageResponse/Satori */}
      <img
        src={noise}
        alt=""
        aria-hidden="true"
        width={1200}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.42,
        }}
      />

      {/* bottom gradient fade — darkens lower third for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${base}ee 0%, transparent 50%)`,
          display: "flex",
        }}
      />

      {/* content — bottom-left anchored */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          padding: "0 80px 52px",
        }}
      >
        {data.tags && data.tags.length > 0 && (
          <span
            style={{
              color: highlight,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
              display: "flex",
            }}
          >
            {data.tags[0]}
          </span>
        )}

        <div
          style={{
            fontSize: data.title.length > 60 ? 42 : data.title.length > 40 ? 48 : 54,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.18,
            maxWidth: 900,
            display: "flex",
            letterSpacing: "-0.02em",
          }}
        >
          {data.title}
        </div>
      </div>

      {/* top-right watermark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 52,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            color: `${highlight}99`,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          xo · research
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return researchSource.getPages().map((page) => ({
    slug: getResearchPageImage(page).segments,
  }));
}
