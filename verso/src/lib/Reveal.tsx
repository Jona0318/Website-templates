import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** vertraging in seconden */
  delay?: number;
  /** verticale verplaatsing in px */
  y?: number;
};

/**
 * Ingetogen scroll-reveal: enkel opacity + transform, één keer.
 * Bij reduced-motion verschijnt de inhoud meteen, zonder beweging.
 */
export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
