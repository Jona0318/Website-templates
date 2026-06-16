import { Fragment } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { Sparkline } from "./Sparkline";
import {
  BRIEFING,
  BRIEFING_ACTION,
  HERO_METRICS,
  type BriefingToken,
} from "../content";

const REVEAL_START = 0.14;
const REVEAL_END = 0.8;

function toneClass(tone?: BriefingToken["tone"]): string {
  return tone ? `w-${tone}` : "";
}

/* ---- Scroll-gekoppeld woord: faint signaal → vast woord ---- */
function ScrollWord({
  token,
  progress,
  index,
  total,
}: {
  token: BriefingToken;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const span = REVEAL_END - REVEAL_START;
  const start = REVEAL_START + (index / total) * span;
  const end = Math.min(REVEAL_END, start + (span / total) * 2.6);
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const y = useTransform(progress, [start, end], [7, 0]);
  return (
    <Fragment>
      <motion.span className={`w ${toneClass(token.tone)}`} style={{ opacity, y }}>
        {token.text}
      </motion.span>{" "}
    </Fragment>
  );
}

/* ---- Gestaggerde variant voor mobiel (geen scroll-koppeling) ---- */
const proseStagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.012 } },
};
const wordIn: Variants = {
  hidden: { opacity: 0.1, y: 7 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

type SignatureProps = {
  progress: MotionValue<number>;
  /** true = scroll-gestuurde desktop-versie; false = compacte/statische versie */
  scrollDriven: boolean;
};

export function Signature({ progress, scrollDriven }: SignatureProps) {
  const reduce = useReducedMotion();
  const total = BRIEFING.length;

  // Scroll-afgeleide waarden (alleen relevant in scrollDriven-modus)
  const rawOpacity = useTransform(progress, [0.06, 0.46], [1, 0.34]);
  const rawY = useTransform(progress, [0.06, 0.46], [0, -6]);
  const actionOpacity = useTransform(progress, [0.79, 0.95], [0, 1]);
  const actionY = useTransform(progress, [0.79, 0.95], [10, 0]);
  const arrowOpacity = useTransform(progress, [0.1, 0.3], [0.25, 1]);

  return (
    <div className="sig" data-mode={scrollDriven ? "scroll" : "static"}>
      {/* RUWE SIGNALEN */}
      <motion.figure
        className="sig__raw"
        style={scrollDriven ? { opacity: rawOpacity, y: rawY } : undefined}
      >
        <figcaption className="sig__cap">
          <span className="kicker">ruwe signalen</span>
        </figcaption>
        <ul className="sig__metrics">
          {HERO_METRICS.map((m) => (
            <li className="metric" key={m.label}>
              <div className="metric__head">
                <span className="metric__label">{m.label}</span>
                <span className={`metric__val ${m.tone}`}>{m.value}</span>
              </div>
              <Sparkline
                id={m.label.replace(/\s/g, "")}
                series={m.series}
                tone={m.tone}
              />
            </li>
          ))}
        </ul>
      </motion.figure>

      {/* TRANSFORMATIE-INDICATOR */}
      <motion.div
        className="sig__arrow"
        aria-hidden="true"
        style={scrollDriven ? { opacity: arrowOpacity } : undefined}
      >
        <span className="sig__arrow-word">wordt</span>
        <svg viewBox="0 0 40 12" width="40" height="12" className="sig__arrow-svg">
          <path
            d="M0 6h35M30 1l6 5-6 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* DE BRIEFING */}
      <div className="sig__brief">
        <figcaption className="sig__cap">
          <span className="kicker">de briefing · vandaag 07:00</span>
        </figcaption>

        {scrollDriven ? (
          <p className="sig__prose">
            {BRIEFING.map((token, i) => (
              <ScrollWord
                key={i}
                token={token}
                index={i}
                total={total}
                progress={progress}
              />
            ))}
          </p>
        ) : reduce ? (
          <p className="sig__prose">
            {BRIEFING.map((token, i) => (
              <Fragment key={i}>
                <span className={`w ${toneClass(token.tone)}`}>{token.text}</span>{" "}
              </Fragment>
            ))}
          </p>
        ) : (
          <motion.p
            className="sig__prose"
            variants={proseStagger}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          >
            {BRIEFING.map((token, i) => (
              <Fragment key={i}>
                <motion.span
                  className={`w ${toneClass(token.tone)}`}
                  variants={wordIn}
                >
                  {token.text}
                </motion.span>{" "}
              </Fragment>
            ))}
          </motion.p>
        )}

        <motion.p
          className="sig__action"
          style={scrollDriven ? { opacity: actionOpacity, y: actionY } : undefined}
        >
          <span className="sig__action-tag">Aanbevolen</span>
          {BRIEFING_ACTION}
        </motion.p>
      </div>
    </div>
  );
}
