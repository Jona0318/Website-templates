import { Reveal } from "../lib/Reveal";
import { PRICING } from "../content";

export function Pricing() {
  return (
    <section
      id="prijzen"
      className="section band-lavender pricing"
      aria-labelledby="pricing-title"
    >
      <div className="shell">
        <div className="pricing__head grid12">
          <Reveal className="pricing__head-inner">
            <p className="kicker">Prijzen</p>
            <h2 id="pricing-title" className="pricing__title">
              Twee abonnementen. Allebei beginnen ze met lezen.
            </h2>
          </Reveal>
        </div>

        <div className="pricing__tiers">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <article className={`tier ${tier.featured ? "tier--featured" : ""}`}>
                <div className="tier__top">
                  <h3 className="tier__name">{tier.name}</h3>
                  {tier.featured && <span className="tier__badge">Aanrader</span>}
                </div>
                <p className="tier__price">
                  <span className="tier__amount">{tier.price}</span>
                  <span className="tier__cadence">{tier.cadence}</span>
                </p>
                <p className="tier__pitch">{tier.pitch}</p>
                <ul className="tier__features">
                  {tier.features.map((feat) => (
                    <li key={feat} className="tier__feature">
                      <span className="tier__check" aria-hidden="true">
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"} tier__cta`}
                >
                  {tier.cta}
                </a>
              </article>
            </Reveal>
          ))}

          <Reveal className="pricing__note-card" delay={0.16}>
            <p className="pricing__note">
              Grotere redactie? <a className="tlink" href="#cta">Praat met ons</a>{" "}
              over een plan met SSO, audit-logs en een eigen schrijfwijze voor je
              merk.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
