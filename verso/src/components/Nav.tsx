import { useEffect, useState } from "react";
import { NAV_LINKS } from "../content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sluit het mobiele menu op Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <p className="nav__dateline" aria-hidden="true">
        De briefing-laag voor je datastack — editie {new Date().getFullYear()}
      </p>
      <div className="nav__bar shell">
        <a href="#top" className="nav__brand" aria-label="Verso, naar boven">
          <span className="nav__mark" aria-hidden="true">
            V
          </span>
          <span className="nav__word">Verso</span>
        </a>

        <nav className="nav__links" aria-label="Hoofdmenu">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__end">
          <a href="#cta" className="btn btn-primary nav__cta">
            Begin gratis
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className={`nav__burger ${open ? "is-open" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="nav-mobile"
        className={`nav__mobile ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Mobiel menu" className="shell nav__mobile-inner">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav__mobile-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="#cta" className="btn btn-primary" onClick={() => setOpen(false)}>
            Begin gratis
          </a>
        </nav>
      </div>
    </header>
  );
}
