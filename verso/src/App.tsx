import { useLenis } from "./lib/useLenis";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { Briefing } from "./components/Briefing";
import { SocialProof } from "./components/SocialProof";
import { Impact } from "./components/Impact";
import { Pricing } from "./components/Pricing";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";

export default function App() {
  useLenis();

  return (
    <>
      <a className="skip-link" href="#main">
        Naar de inhoud
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Briefing />
        <SocialProof />
        <Impact />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
