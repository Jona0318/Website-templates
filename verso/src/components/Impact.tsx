import { Reveal } from "../lib/Reveal";
import { STATS } from "../content";

export function Impact() {
  return (
    <section className="section band-paper impact" aria-labelledby="impact-title">
      <div className="shell">
        <Reveal>
          <h2 id="impact-title" className="impact__title">
            Wat het oplevert<span className="impact__dot">.</span>
          </h2>
        </Reveal>
        <dl className="impact__grid">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="impact__item">
                <dt className="impact__value">{s.value}</dt>
                <dd className="impact__label">
                  {s.label}
                  <span className="impact__note">{s.note}</span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
