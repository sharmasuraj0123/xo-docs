import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getResearchPageImage, researchSource } from "@/lib/source";

export const revalidate = false;

function slugHash(slug: string): number {
  let h = 0;
  for (const c of slug) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h) % 999;
}

function noiseDataUri(seed: number): string {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">`,
    `<filter id="n">`,
    `<feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>`,
    `<feColorMatrix type="saturate" values="0"/>`,
    `</filter>`,
    `<rect width="100%" height="100%" filter="url(#n)" opacity="1"/>`,
    `</svg>`,
  ].join("");
  const b64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

  const seed = slugHash(slug.join("/"));
  const noise = noiseDataUri(seed);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          position: "relative",
          background:
            "linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 40%, #0f2a52 70%, #0a1628 100%)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* noise grain layer */}
        <img
          src={noise}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.08,
            mixBlendMode: "overlay",
          }}
        />
        {/* blue vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.18) 0%, transparent 65%)",
            display: "flex",
          }}
        />
        {/* subtle top edge glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.4) 50%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* content — bottom-anchored */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "72px 80px",
          }}
        >
          {data.tags && data.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  color: "#93c5fd",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {data.tags[0]}
              </span>
            </div>
          )}

          <div
            style={{
              fontSize: data.title.length > 60 ? 52 : 64,
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.15,
              maxWidth: 920,
              display: "flex",
            }}
          >
            {data.title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 28,
            }}
          >
            {data.date && (
              <span
                style={{
                  color: "#64748b",
                  fontSize: 18,
                }}
              >
                {formatDate(data.date)}
              </span>
            )}
            <span
              style={{
                color: "#1e3a5f",
                fontSize: 18,
                marginLeft: "auto",
                letterSpacing: "0.08em",
                fontWeight: 500,
              }}
            >
              xo research
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return researchSource.getPages().map((page) => ({
    slug: getResearchPageImage(page).segments,
  }));
}
