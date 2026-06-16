import { Reveal } from "../lib/Reveal";

export function Problem() {
  return (
    <section className="section band-paper problem" aria-labelledby="problem-title">
      <div className="shell grid12 problem__grid">
        <Reveal className="problem__aside">
          <p className="kicker">Het ongemak</p>
          <p className="problem__note">
            De gemiddelde scale-up bouwde zeventien dashboards. Op een dinsdag
            opent niemand er meer dan twee.
          </p>
        </Reveal>

        <Reveal className="problem__main" delay={0.08}>
          <h2 id="problem-title" className="problem__statement">
            Een dashboard <em>toont</em> je honderd cijfers en laat je raden welke
            ertoe doet. Tegen de tijd dat je het verhaal hebt gereconstrueerd, is
            de ochtend voorbij.
          </h2>
          <p className="problem__after">
            Dashboards zijn geen verhaal. Het zijn losse woorden waar iemand nog
            een zin van moet maken — elke dag opnieuw, in elk hoofd apart.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
