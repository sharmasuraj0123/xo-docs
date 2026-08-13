import type { ReactNode } from "react";

// Research figures and data tables. Theme-aware (fd-* tokens), no external deps,
// no second typeface — numerals lean on tabular figures of the inherited face.

// Figures align with the article column (capped at 42rem) rather than bleeding into
// the space to its right — a box wider than the prose reads as escaped, not as
// emphasis. Content that genuinely needs more room scrolls inside its own border
// via `minWidth` below, which is also what happens below the column width.
const BLEED = "w-full";

// Table chrome, applied to any <table> inside a Figure — so markdown pipe tables
// and <DataTable> land on the same look.
const TABLE = [
  // auto layout suits the prose-cell markdown tables; DataTable opts into fixed
  "[&_table]:w-full [&_table]:border-collapse",
  "[&_table]:text-sm [&_table]:text-fd-foreground",
  // header: one solid hairline under it, no vertical rules anywhere
  "[&_thead_th]:border-b [&_thead_th]:border-fd-border",
  "[&_thead_th]:px-2.5 [&_thead_th]:py-2.5",
  "[&_thead_th]:text-xs [&_thead_th]:font-medium [&_thead_th]:leading-snug",
  "[&_thead_th]:text-fd-muted-foreground [&_thead_th]:align-bottom",
  "[&_tbody_td]:border-b [&_tbody_td]:border-fd-border/50",
  "[&_tbody_td]:px-2.5 [&_tbody_td]:py-2.5 [&_tbody_td]:align-top",
  "[&_tbody_tr:last-child_td]:border-b-0",
  "[&_tbody_td]:[font-variant-numeric:tabular-nums]",
  // markdown group rows — a label followed by empty cells — become subhead bands
  "[&_tbody_tr:has(td:nth-child(2):empty)]:bg-fd-muted/40",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td]:border-b-0",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td]:py-1.5",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td:first-child]:text-[11px]",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td:first-child]:font-medium",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td:first-child]:uppercase",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td:first-child]:tracking-widest",
  "[&_tbody_tr:has(td:nth-child(2):empty)_td:first-child]:text-fd-muted-foreground",
  "[&_tbody_tr:has(td:nth-child(2):empty)_em]:not-italic",
].join(" ");

export function Figure({
  n,
  title,
  caption,
  minWidth,
  children,
}: {
  n: string;
  title: string;
  caption?: ReactNode;
  /** px width below which the figure scrolls instead of squeezing */
  minWidth?: number;
  children: ReactNode;
}) {
  return (
    <figure className={`not-prose my-8 ${BLEED}`}>
      <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-[11px] font-medium uppercase tracking-widest text-fd-primary">
          {n}
        </span>
        <span className="text-sm font-medium text-fd-foreground">{title}</span>
      </figcaption>

      <div
        className={`overflow-x-auto rounded-2xl border border-fd-border bg-fd-card ${TABLE}`}
      >
        <div style={minWidth ? { minWidth } : undefined}>{children}</div>
      </div>

      {caption ? (
        <div className="mt-3 text-xs leading-relaxed text-fd-muted-foreground">
          {caption}
        </div>
      ) : null}
    </figure>
  );
}

type Align = "left" | "right" | "center";

export interface Column {
  label: string;
  align?: Align;
  /** column width as a CSS value, e.g. "18%" */
  width?: string;
}

export interface Group {
  label?: string;
  /** how many of the columns this group spans */
  span: number;
}

export type Row =
  | { kind: "subhead"; label: string }
  | { kind?: "data"; cells: ReactNode[]; emphasis?: boolean };

const ALIGN: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

// A table with an optional spanning header row — the thing markdown pipe tables
// cannot express, and the reason Table 2's headers used to wrap onto three lines.
export function DataTable({
  columns,
  groups,
  rows,
}: {
  columns: Column[];
  groups?: Group[];
  rows: Row[];
}) {
  return (
    <table className="table-fixed">
      <colgroup>
        {columns.map((c) => (
          <col key={c.label} style={c.width ? { width: c.width } : undefined} />
        ))}
      </colgroup>
      <thead>
        {groups ? (
          <tr>
            {groups.map((g, i) => (
              <th
                // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional
                key={`${g.label ?? "blank"}-${i}`}
                colSpan={g.span}
                scope="colgroup"
                className={`!border-b-0 !pb-1 text-center ${
                  i > 0 ? "border-s border-fd-border/50" : ""
                } ${g.label ? "!font-semibold !text-fd-foreground" : ""}`}
              >
                {g.label ?? ""}
              </th>
            ))}
          </tr>
        ) : null}
        <tr>
          {columns.map((c) => (
            <th key={c.label} scope="col" className={ALIGN[c.align ?? "left"]}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) =>
          row.kind === "subhead" ? (
            <tr
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional
              key={`subhead-${i}`}
              className="bg-fd-muted/40"
            >
              <td
                colSpan={columns.length}
                className="!border-b-0 !py-1.5 text-[11px] font-medium uppercase tracking-widest text-fd-muted-foreground"
              >
                {row.label}
              </td>
            </tr>
          ) : (
            <tr
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional
              key={`row-${i}`}
              className={row.emphasis ? "bg-fd-primary/5 font-medium" : ""}
            >
              {row.cells.map((cell, j) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                  key={`cell-${j}`}
                  className={ALIGN[columns[j]?.align ?? "left"]}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

// A filled marker for boolean columns, so "on" reads without a second glyph font.
export function On() {
  return (
    <span
      className="inline-block size-1.5 rounded-full bg-fd-primary align-middle"
      role="img"
      aria-label="yes"
    />
  );
}

export function Off() {
  return (
    <span className="text-fd-muted-foreground/60" role="img" aria-label="no">
      —
    </span>
  );
}

// A gain printed beside the score it belongs to, in the primary token.
export function Delta({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap text-xs font-medium text-fd-primary">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Grouped horizontal bars, two series.
//
// Palette: slots 1 and 2 of the reference categorical palette, stepped per mode
// and validated in both (light #2a78d6/#eb6834, dark #3987e5/#d95926 — worst
// adjacent CVD ΔE 24.7 light / 26.8 dark, normal-vision ΔE 33.6 / 31.8, contrast
// ≥ 3:1, lightness in band). Values are direct-labelled at each bar end, which is
// why this ships without a hover layer.
// ---------------------------------------------------------------------------

export interface BarRow {
  label: string;
  a: number;
  b: number;
  emphasis?: boolean;
}

// The viewBox is sized to the rendered box (42rem column − the svg's own p-4), so
// the scale factor is 1 and every font size below is the px size a reader gets.
const VB_W = 640;
const PLOT_X = 158; // left edge of the plot area; 146px of it is the label gutter
const PLOT_R = 40; // room at the right for the value label of a full-width bar
const BAR_H = 12;
const BAR_GAP = 2; // surface gap inside a pair
const ROW_GAP = 18; // gap between pairs
const HEAD_H = 58;
const AXIS_H = 26;
// legend sits right of the title block, clear of it — the title runs to ~x 340
const LEGEND_X = 440;

// A bar with only its data end rounded, anchored square to the baseline.
function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w);
  if (w <= 0) return "";
  return [
    `M${x},${y}`,
    `H${x + w - r}`,
    `a${r},${r} 0 0 1 ${r},${r}`,
    `V${y + h - r}`,
    `a${r},${r} 0 0 1 ${-r},${r}`,
    `H${x}`,
    "Z",
  ].join(" ");
}

export function BarCompare({
  title,
  subtitle,
  seriesA,
  seriesB,
  rows,
  max = 100,
  ticks = [0, 25, 50, 75, 100],
  unit = "",
}: {
  title: string;
  subtitle: string;
  seriesA: string;
  seriesB: string;
  rows: BarRow[];
  max?: number;
  ticks?: number[];
  unit?: string;
}) {
  const plotW = VB_W - PLOT_X - PLOT_R;
  const rowH = BAR_H * 2 + BAR_GAP;
  const pitch = rowH + ROW_GAP;
  const plotH = rows.length * pitch - ROW_GAP;
  const vbH = HEAD_H + plotH + AXIS_H;
  const scale = (v: number) => (v / max) * plotW;

  return (
    <div className="[--s1:#2a78d6] [--s2:#eb6834] dark:[--s1:#3987e5] dark:[--s2:#d95926]">
      <svg
        viewBox={`0 0 ${VB_W} ${vbH}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${title}. ${subtitle}`}
        className="block h-auto w-full p-4 text-fd-foreground"
      >
        <title>{title}</title>

        <text x="0" y="16" fontSize="15" fill="currentColor" fontWeight="600">
          {title}
        </text>
        <text
          x="0"
          y="34"
          fontSize="11.5"
          fill="currentColor"
          fillOpacity="0.6"
        >
          {subtitle}
        </text>

        {/* legend */}
        <rect
          x={LEGEND_X}
          y={5}
          width="10"
          height="10"
          rx="2"
          fill="var(--s1)"
        />
        <text
          x={LEGEND_X + 16}
          y={14}
          fontSize="11"
          fill="currentColor"
          fillOpacity="0.75"
        >
          {seriesA}
        </text>
        <rect
          x={LEGEND_X}
          y={24}
          width="10"
          height="10"
          rx="2"
          fill="var(--s2)"
        />
        <text
          x={LEGEND_X + 16}
          y={33}
          fontSize="11"
          fill="currentColor"
          fillOpacity="0.75"
        >
          {seriesB}
        </text>

        {/* gridlines — solid hairlines, one shade off the surface */}
        {ticks.map((t) => {
          const x = PLOT_X + scale(t);
          return (
            <g key={t}>
              <line
                x1={x}
                y1={HEAD_H - 8}
                x2={x}
                y2={HEAD_H + plotH + 4}
                stroke="currentColor"
                strokeOpacity="0.12"
              />
              <text
                x={x}
                y={HEAD_H + plotH + AXIS_H - 6}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                fillOpacity="0.55"
              >
                {t}
              </text>
            </g>
          );
        })}

        {rows.map((row, i) => {
          const top = HEAD_H + i * pitch;
          const wA = scale(row.a);
          const wB = scale(row.b);
          return (
            <g key={row.label}>
              <text
                x={PLOT_X - 12}
                y={top + rowH / 2 + 4}
                textAnchor="end"
                fontSize="12"
                fill="currentColor"
                fillOpacity={row.emphasis ? "1" : "0.85"}
                fontWeight={row.emphasis ? "600" : undefined}
              >
                {row.label}
              </text>

              <path
                d={barPath(PLOT_X, top, wA, BAR_H)}
                fill="var(--s1)"
                fillOpacity={row.emphasis ? "1" : "0.85"}
              />
              <text
                x={PLOT_X + wA + 6}
                y={top + BAR_H - 2}
                fontSize="11"
                fill="currentColor"
                fillOpacity="0.7"
              >
                {row.a.toFixed(1)}
                {unit}
              </text>

              <path
                d={barPath(PLOT_X, top + BAR_H + BAR_GAP, wB, BAR_H)}
                fill="var(--s2)"
                fillOpacity={row.emphasis ? "1" : "0.85"}
              />
              <text
                x={PLOT_X + wB + 6}
                y={top + BAR_H * 2 + BAR_GAP - 2}
                fontSize="11"
                fill="currentColor"
                fillOpacity="0.7"
              >
                {row.b.toFixed(1)}
                {unit}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
