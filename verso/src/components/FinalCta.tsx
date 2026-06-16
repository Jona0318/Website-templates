import { Reveal } from "../lib/Reveal";
import { MagneticButton } from "../lib/MagneticButton";

export function FinalCta() {
  return (
    <section id="cta" className="section band-ink finalcta" aria-labelledby="cta-title">
      <div className="shell finalcta__inner">
        <Reveal>
          <p className="kicker">Begin morgen</p>
          <h2 id="cta-title" className="finalcta__title">
            Morgen om 07:00 ligt je eerste briefing klaar.
          </h2>
          <p className="finalcta__lede">
            Verbind één bron vanavond. Lees morgenochtend wat er veranderde — in
            woorden, niet in grafieken.
          </p>
          <div className="finalcta__actions">
            <MagneticButton href="#cta" ariaLabel="Begin gratis met Verso">
              Begin gratis
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </MagneticButton>
            <a className="btn btn-ghost" href="#briefing">
              Lees eerst een briefing
            </a>
          </div>
          <p className="finalcta__fine">
            Geen creditcard · klaar in 9 minuten · elke zin herleidbaar
          </p>
        </Reveal>
      </div>
    </section>
  );
}
