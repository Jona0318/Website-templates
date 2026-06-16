import { useState } from "react";
import { Reveal } from "../lib/Reveal";
import { FAQ } from "../content";

export function Faq() {
  // Eerste item open; één tegelijk, maar elk handmatig te sluiten.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section band-paper faq" aria-labelledby="faq-title">
      <div className="shell grid12 faq__grid">
        <Reveal className="faq__aside">
          <p className="kicker">Veelgevraagd</p>
          <h2 id="faq-title" className="faq__title">
            Nog even dit, voor je begint.
          </h2>
          <p className="faq__sub">
            Staat je vraag er niet bij?{" "}
            <a className="tlink" href="#cta">
              We schrijven je terug
            </a>
            .
          </p>
        </Reveal>

        <Reveal className="faq__list" delay={0.06}>
          <ul>
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              const btnId = `faq-btn-${i}`;
              return (
                <li key={item.q} className={`qa ${isOpen ? "is-open" : ""}`}>
                  <h3 className="qa__h">
                    <button
                      id={btnId}
                      type="button"
                      className="qa__trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className="qa__q">{item.q}</span>
                      <span className="qa__sign" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className="qa__panel"
                    hidden={!isOpen}
                  >
                    <p className="qa__a">{item.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
