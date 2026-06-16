import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll via Lenis. Volledig uitgeschakeld bij prefers-reduced-motion,
 * en netjes opgeruimd bij unmount. Faalt stil terug op native scroll.
 */
export function useLenis(): void {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
