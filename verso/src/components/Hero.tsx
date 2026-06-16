import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { Signature } from "./Signature";
import { MagneticButton } from "../lib/MagneticButton";
import { useMediaQuery } from "../lib/useMediaQuery";

export function Hero() {
  const reduce = useReducedMotion();
  const isWide = useMediaQuery("(min-width: 900px)");
  const scrollDriven = isWide && !reduce;

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="top"
      ref={heroRef}
      className={`hero band-lavender ${scrollDriven ? "hero--scroll" : "hero--static"}`}
      aria-label="Introductie"
    >
      <div className="hero__stage">
        <div className="shell hero__grid">
          <div className="hero__lead">
            <motion.p
              className="kicker hero__kicker"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Narrative analytics
            </motion.p>

            <h1 className="hero__title">
              <motion.span
                className="hero__line"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
              >
                Niemand opent
                <br />
                je dashboard.
              </motion.span>
              <motion.span
                className="hero__line hero__line--accent"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              >
                Iedereen leest
                <br />
                je briefing.
              </motion.span>
            </h1>

            <motion.p
              className="hero__lede"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
            >
              Verso zet je product- en bedrijfsmetrics om in een geschreven
              ochtendbriefing — in mensentaal, met de bron onder elke zin.
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
            >
              <MagneticButton href="#briefing" ariaLabel="Lees een voorbeeldbriefing">
                Lees een briefing
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </MagneticButton>
              <a className="btn btn-ghost" href="#werkwijze">
                Zo werkt het
              </a>
            </motion.div>

            <p className="hero__fineprint">
              Geen creditcard · je eerste briefing ligt morgen om 07:00 klaar
            </p>
          </div>

          <div className="hero__signature">
            <Signature progress={scrollYProgress} scrollDriven={scrollDriven} />
          </div>
        </div>
      </div>

      {scrollDriven && (
        <span className="hero__scrollhint" aria-hidden="true">
          scroll — de data schrijft zichzelf
        </span>
      )}
    </section>
  );
}
