import { FOOTER_COLUMNS } from "../content";

export function Footer() {
  return (
    <footer className="footer band-paper" aria-labelledby="footer-title">
      <div className="shell footer__inner">
        <div className="footer__brandcol">
          <a href="#top" className="footer__brand">
            <span className="nav__mark" aria-hidden="true">
              V
            </span>
            <span>Verso</span>
          </a>
          <p className="footer__pitch" id="footer-title">
            De briefing-laag voor je datastack. Elke ochtend het verhaal van
            gisteren — herleidbaar tot de bron.
          </p>
          <a href="#cta" className="tlink footer__cta">
            Begin gratis →
          </a>
        </div>

        <nav className="footer__nav" aria-label="Voettekst">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.head} className="footer__col">
              <h2 className="footer__head">{col.head}</h2>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="footer__link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="shell footer__colophon">
        <p className="footer__set">
          Gezet in <span>Fraunces</span>, <span>Hanken Grotesk</span> en{" "}
          <span>JetBrains Mono</span>. Geschreven, niet gegenereerd.
        </p>
        <p className="footer__legal">
          © {new Date().getFullYear()} Verso. Een fictief product, met zorg
          getypeset.
        </p>
      </div>
    </footer>
  );
}
