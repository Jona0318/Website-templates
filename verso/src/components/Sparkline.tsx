import { motion, type MotionValue } from "motion/react";

type SparklineProps = {
  series: number[];
  /** scroll-voortgang 0..1 die de lijn laat tekenen; weglaten = direct getekend */
  draw?: MotionValue<number>;
  tone?: "up" | "warn";
  id: string;
};

const W = 132;
const H = 40;

/** Bouwt een gladde-ish polyline uit genormaliseerde waarden. */
function toPath(series: number[]): string {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const stepX = W / (series.length - 1);
  return series
    .map((v, i) => {
      const x = i * stepX;
      const y = H - 4 - ((v - min) / span) * (H - 8);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * Kleine sparkline in SVG. De lijn "tekent zich" op scroll-voortgang als die
 * is meegegeven; anders staat hij meteen volledig (reduced-motion / statisch).
 */
export function Sparkline({ series, draw, tone = "up", id }: SparklineProps) {
  const d = toPath(series);
  const stroke = tone === "warn" ? "var(--indigo-deep)" : "var(--indigo)";
  const last = series.length - 1;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const dotX = last * (W / last);
  const dotY = H - 4 - ((series[last] - min) / span) * (H - 8);

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.16" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill={`url(#fade-${id})`} opacity="0.9" />
      {draw ? (
        <motion.path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: draw }}
        />
      ) : (
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <circle cx={dotX} cy={dotY} r="2.6" fill={stroke} />
    </svg>
  );
}
