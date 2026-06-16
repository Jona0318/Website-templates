import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Magnetische primaire CTA: de knop leunt subtiel naar de cursor.
 * Uitgeschakeld bij reduced-motion en op touch (pointer: coarse) blijft hij
 * gewoon stilstaan — de hover-handlers vuren daar simpelweg niet.
 */
export function MagneticButton({
  children,
  href = "#cta",
  className = "",
  ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.28);
    y.set(relY * 0.32);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      className={`btn btn-primary ${className}`}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.a>
  );
}
