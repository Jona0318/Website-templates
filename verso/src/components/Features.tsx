import { Reveal } from "../lib/Reveal";
import { Sparkline } from "./Sparkline";
import { FEATURES } from "../content";

/* Per functie een eigen, met de hand gezette mini-artefact — geen stock,
   geen iconen-set. Elk visueel toont de functie ipv hem te illustreren. */
function FeatureVisual({ index }: { index: string }) {
  switch (index) {
    case "i":
      return (
        <div className="fviz fviz--inbox" aria-hidden="true">
          <div className="fviz__row">
            <span className="fviz__tag">07:00</span>
            <span className="fviz__from">Verso · Ochtendbriefing</span>
          </div>
          <p className="fviz__snippet">
            “Gisteren steeg de activatie met <b>12%</b> — de hoogste in zes weken…”
          </p>
          <div className="fviz__channel">#groei · ook in Slack geplaatst</div>
        </div>
      );
    case "ii":
      return (
        <div className="fviz fviz--anomaly" aria-hidden="true">
          <Sparkline id="feat-anomaly" series={[40, 42, 41, 44, 43, 58, 51]} tone="up" />
          <div className="fviz__callout">
            <span className="fviz__pin" />
            piek = release variant B, niet seizoen
          </div>
        </div>
      );
    case "iii":
      return (
        <div className="fviz fviz--ask" aria-hidden="true">
          <p className="fviz__q">“Waarom liep de omzet in maart achter?”</p>
          <p className="fviz__a">
            Twee enterprise-deals verschoven naar Q2; onderliggend groeide MRR
            <b> 4%</b>.
          </p>
          <span className="fviz__src">bron · stripe.mrr_daily ↗</span>
        </div>
      );
    case "iv":
      return (
        <div className="fviz fviz--memo" aria-hidden="true">
          <div className="fviz__memo">
            <span className="fviz__memo-h">Memo — week 24</span>
            <span className="fviz__memo-l" />
            <span className="fviz__memo-l" />
            <span className="fviz__memo-l short" />
          </div>
          <span className="fviz__pages">deel · PDF · board-update</span>
        </div>
      );
    default:
      return (
        <div className="fviz fviz--trace" aria-hidden="true">
          <p className="fviz__trace">
            …de stijging komt van{" "}
            <span className="fviz__link">variant B</span>.
          </p>
          <span className="fviz__chip">↳ events.onboarding · variant = B</span>
        </div>
      );
  }
}

export function Features() {
  return (
    <section
      id="functies"
      className="section band-paper features"
      aria-labelledby="features-title"
    >
      <div className="shell">
        <div className="features__head grid12">
          <Reveal className="features__head-inner">
            <p className="kicker">Wat Verso doet</p>
            <h2 id="features-title" className="features__title">
              Vijf manieren waarop cijfers tekst worden.
            </h2>
          </Reveal>
        </div>

        <div className="features__list">
          {FEATURES.map((f, i) => (
            <article
              key={f.index}
              className={`spread ${i % 2 === 1 ? "spread--flip" : ""}`}
            >
              <Reveal className="spread__text">
                <span className="spread__index" aria-hidden="true">
                  {f.index}
                </span>
                <h3 className="spread__title">{f.title}</h3>
                <p className="spread__body">{f.body}</p>
                <span className="spread__aside">{f.aside}</span>
              </Reveal>
              <Reveal className="spread__viz" delay={0.08}>
                <FeatureVisual index={f.index} />
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
