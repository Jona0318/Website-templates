import { Reveal } from "../lib/Reveal";
import { QUOTE, LOGOS } from "../content";

export function SocialProof() {
  return (
    <section className="section band-ink proof" aria-labelledby="proof-title">
      <div className="shell">
        <Reveal className="proof__quote-wrap">
          <p className="kicker" id="proof-title">
            Wat teams ervan zeggen
          </p>
          <blockquote className="proof__quote">
            <span className="proof__mark" aria-hidden="true">
              “
            </span>
            {QUOTE.text}
          </blockquote>
          <footer className="proof__cite">
            <span className="proof__name">{QUOTE.name}</span>
            <span className="proof__role">{QUOTE.role}</span>
          </footer>
        </Reveal>

        <Reveal className="proof__logos" delay={0.1}>
          <span className="proof__logos-label">Gelezen bij</span>
          <ul className="proof__logo-row">
            {LOGOS.map((logo) => (
              <li key={logo} className="proof__logo">
                {logo}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
