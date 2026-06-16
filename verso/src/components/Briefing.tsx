import { Reveal } from "../lib/Reveal";
import { BRIEFING_ACTION } from "../content";

const SOURCES = [
  { label: "activatie", src: "product.activation_daily" },
  { label: "support-druk", src: "zendesk.tickets_per_dag" },
  { label: "variant B", src: "events.onboarding · variant" },
];

export function Briefing() {
  return (
    <section
      id="briefing"
      className="section band-lavender briefing"
      aria-labelledby="briefing-title"
    >
      <div className="shell grid12 briefing__grid">
        <Reveal className="briefing__intro">
          <p className="kicker">Een echte briefing</p>
          <h2 id="briefing-title" className="briefing__title">
            Dit is het hele product. Eén alinea, elke ochtend.
          </h2>
          <p className="lede">
            Geen samenvatting van een dashboard, maar het verhaal eronder —
            getypeset om gelezen te worden, niet gescand.
          </p>
        </Reveal>

        <Reveal className="briefing__memo-wrap" delay={0.1}>
          <article className="memo" aria-label="Voorbeeldbriefing van Verso">
            <header className="memo__head">
              <span className="memo__brand">Verso · Ochtendbriefing</span>
              <span className="memo__date">di 16 jun · 07:00</span>
            </header>

            <p className="memo__body">
              <span className="memo__drop" aria-hidden="true">
                G
              </span>
              <span className="memo__first">isteren</span> steeg de activatie met{" "}
              <strong>12%</strong> — de hoogste in zes weken. Vrijwel de hele
              stijging komt van de nieuwe onboarding{" "}
              <strong>(variant B)</strong>, die nu <strong>64%</strong> van de
              nieuwe accounts ziet. Let op: de support-druk liep mee op{" "}
              <em>(+8%)</em>, waarschijnlijk dezelfde cohort.
            </p>

            <p className="memo__action">
              <span className="memo__action-tag">Aanbevolen</span>
              {BRIEFING_ACTION}
            </p>

            <footer className="memo__foot">
              <span className="memo__foot-label">Herleidbaar tot</span>
              <ul className="memo__sources">
                {SOURCES.map((s) => (
                  <li key={s.label} className="memo__source">
                    <span className="memo__source-key">{s.label}</span>
                    <span className="memo__source-src">{s.src}</span>
                  </li>
                ))}
              </ul>
            </footer>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
