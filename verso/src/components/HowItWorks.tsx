import { Reveal } from "../lib/Reveal";
import { STEPS } from "../content";

export function HowItWorks() {
  return (
    <section
      id="werkwijze"
      className="section band-ink how"
      aria-labelledby="how-title"
    >
      <div className="shell">
        <div className="how__head grid12">
          <Reveal className="how__head-inner">
            <p className="kicker">Zo werkt het</p>
            <h2 id="how-title" className="how__title">
              Van bron tot briefing in drie stappen — daarna nooit meer aanraken.
            </h2>
          </Reveal>
        </div>

        <ol className="how__steps">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <li className="step" style={{ "--i": i } as React.CSSProperties}>
                <span className="step__n">{step.n}</span>
                <div className="step__body">
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__text">{step.body}</p>
                  <span className="step__meta">{step.meta}</span>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
