/* ============================================================
   Verso — alle copy op één plek (Nederlands, editorial stem).
   ============================================================ */

export const NAV_LINKS = [
  { href: "#werkwijze", label: "Zo werkt het" },
  { href: "#functies", label: "Functies" },
  { href: "#briefing", label: "Een briefing" },
  { href: "#prijzen", label: "Prijzen" },
] as const;

/* De voorbeeld-briefing (§2) — bron voor het signature-moment én de
   briefing-sectie. Opgesplitst in fragmenten zodat we accenten kunnen zetten. */
export type BriefingToken = { text: string; tone?: "key" | "warn" | "act" };

export const BRIEFING: BriefingToken[] = [
  { text: "Gisteren" },
  { text: "steeg" },
  { text: "de" },
  { text: "activatie" },
  { text: "met" },
  { text: "12%", tone: "key" },
  { text: "—" },
  { text: "de" },
  { text: "hoogste" },
  { text: "in" },
  { text: "zes" },
  { text: "weken." },
  { text: "Vrijwel" },
  { text: "de" },
  { text: "hele" },
  { text: "stijging" },
  { text: "komt" },
  { text: "van" },
  { text: "de" },
  { text: "nieuwe" },
  { text: "onboarding" },
  { text: "(variant B),", tone: "key" },
  { text: "die" },
  { text: "nu" },
  { text: "64%" },
  { text: "van" },
  { text: "de" },
  { text: "nieuwe" },
  { text: "accounts" },
  { text: "ziet." },
  { text: "Let" },
  { text: "op:" },
  { text: "de" },
  { text: "support-druk" },
  { text: "liep" },
  { text: "mee" },
  { text: "op" },
  { text: "(+8%),", tone: "warn" },
  { text: "waarschijnlijk" },
  { text: "dezelfde" },
  { text: "cohort." },
];

/* De aanbeveling staat los — verschijnt als laatste, geaccentueerd. */
export const BRIEFING_ACTION =
  "Rol variant B uit naar 100% en werk het help-artikel over stap 3 bij.";

export const HERO_METRICS = [
  { label: "activatie", value: "+12%", series: [38, 41, 39, 44, 42, 51, 64], tone: "up" as const },
  { label: "support-druk", value: "+8%", series: [50, 48, 52, 51, 55, 58, 62], tone: "warn" as const },
  { label: "variant B-aandeel", value: "64%", series: [12, 20, 28, 37, 49, 57, 64], tone: "up" as const },
];

export const STEPS = [
  {
    n: "01",
    title: "Verbind je bronnen",
    body: "Koppel je warehouse, product-analytics en Stripe. Verso leest je metrics zoals ze zijn — geen modellen om te onderhouden, geen dashboards om te bouwen.",
    meta: "≈ 9 minuten",
  },
  {
    n: "02",
    title: "Verso leest mee, elke nacht",
    body: "Terwijl jij slaapt vergelijkt Verso elke metric met zijn verleden, weegt de context en schrijft op wat ertoe doet. Niet alles — alleen wat veranderde.",
    meta: "volautomatisch",
  },
  {
    n: "03",
    title: "De briefing ligt klaar",
    body: "Om 7:00 staat het verhaal van gisteren in je inbox of Slack. Eén alinea, in mensentaal, met de bron onder elke zin. Lezen kost een minuut.",
    meta: "07:00, elke werkdag",
  },
];

export type Feature = {
  index: string;
  title: string;
  body: string;
  aside: string;
};

export const FEATURES: Feature[] = [
  {
    index: "i",
    title: "Een ochtendbriefing, geen dashboard",
    body: "Elke ochtend schrijft Verso het verhaal van wat er veranderde — automatisch, in mensentaal, in je inbox of Slack. Geen tabbladen om te openen, geen grafiek om te ontcijferen.",
    aside: "Levering 07:00 · inbox + Slack",
  },
  {
    index: "ii",
    title: "Een piek krijgt een reden",
    body: "Een dip of uitschieter wordt niet alleen gesignaleerd, maar geduid. Verso legt naast de verandering de waarschijnlijke oorzaak — met de cohort, de release of de campagne die het verklaart.",
    aside: "Anomalie-duiding mét context",
  },
  {
    index: "iii",
    title: "Vraag het in gewone taal",
    body: "“Waarom liep de omzet in maart achter?” Stel de vraag zoals je hem aan een collega zou stellen, en krijg een geschreven antwoord terug — met de cijfers waarop het rust.",
    aside: "Antwoord in proza, met bron",
  },
  {
    index: "iv",
    title: "Deel een memo, geen schermafdruk",
    body: "Elke briefing is ook een nette memo: getypeset, deelbaar, klaar voor je board-update of je standup. Plak geen losse grafieken meer aan elkaar.",
    aside: "Deelbaar als memo of PDF",
  },
  {
    index: "v",
    title: "Geen black box",
    body: "Elke zin die Verso schrijft linkt terug naar de onderliggende data. Klik door op een bewering en je staat bij de query. Vertrouwen begint bij herleidbaarheid.",
    aside: "Elke zin → bron, één klik",
  },
];

export const STATS = [
  { value: "1 min", label: "om de briefing van gisteren te lezen", note: "i.p.v. zeven tabbladen" },
  { value: "07:00", label: "klaar, elke werkdag", note: "voor je eerste koffie" },
  { value: "100%", label: "van de zinnen herleidbaar", note: "tot de bron-query" },
  { value: "0", label: "dashboards om te onderhouden", note: "Verso schrijft, jij leest" },
];

export const QUOTE = {
  text: "We hadden zeventien dashboards en niemand die ze opende. Nu leest het hele team één alinea bij de koffie — en we weten eindelijk allemaal hetzelfde.",
  name: "Maartje de Wit",
  role: "Hoofd Product, Haleffort",
};

export const LOGOS = ["Haleffort", "Kavel", "Noord & Co", "Tij", "Vlinder", "Reeks"];

export const PRICING = [
  {
    name: "Redactie",
    price: "€0",
    cadence: "voor altijd",
    pitch: "Voor de solo-founder die het verhaal wil lezen voor het te laat is.",
    features: [
      "Dagelijkse ochtendbriefing",
      "Tot 3 verbonden bronnen",
      "Vraag in gewone taal (50 / maand)",
      "Levering per e-mail",
    ],
    cta: "Begin gratis",
    featured: false,
  },
  {
    name: "Hoofdredactie",
    price: "€280",
    cadence: "per maand",
    pitch: "Voor het team dat elke ochtend op dezelfde alinea wil starten.",
    features: [
      "Alles uit Redactie, zonder limieten",
      "Onbeperkte bronnen + Slack-levering",
      "Anomalie-duiding met context",
      "Deelbare memo’s en board-exports",
      "Herleidbaar tot elke bron-query",
    ],
    cta: "Start 14 dagen proef",
    featured: true,
  },
];

export const FAQ = [
  {
    q: "Vervangt Verso onze dashboards?",
    a: "Nee — Verso leest ze. Je houdt je warehouse en je tools; Verso legt er een briefing-laag overheen die het verhaal vertelt dat in de grafieken verstopt zit. De cijfers blijven van jou, de duiding doet Verso.",
  },
  {
    q: "Hoe weet ik dat een bewering klopt?",
    a: "Elke zin in een briefing linkt terug naar de query en de cijfers eronder. Klik door en je staat bij de bron. Geen black box: als Verso iets schrijft, kun je het natrekken.",
  },
  {
    q: "Welke bronnen kan ik koppelen?",
    a: "Warehouses zoals BigQuery, Snowflake en Postgres, product-analytics, en omzet uit Stripe. Verbinden kost een paar minuten en vraagt geen modelwerk — Verso leest je metrics zoals ze zijn.",
  },
  {
    q: "Schrijft Verso ook in het Engels?",
    a: "Ja. Briefings kunnen per team in het Nederlands of Engels — dezelfde rustige, redactionele stem, in de taal die jullie spreken.",
  },
  {
    q: "Wat gebeurt er met onze data?",
    a: "Verso leest, schrijft en linkt — en bewaart niet meer dan nodig is om dat te doen. Versleuteld onderweg en in rust, en je trekt een bron met één klik weer los.",
  },
];

export const FOOTER_COLUMNS = [
  {
    head: "Product",
    links: ["Ochtendbriefing", "Anomalie-duiding", "Vraag & antwoord", "Memo’s", "Herleidbaarheid"],
  },
  {
    head: "Bronnen",
    links: ["Documentatie", "Changelog", "Status", "Veiligheid"],
  },
  {
    head: "Studio",
    links: ["Over Verso", "Schrijfwijze", "Contact", "Werken bij"],
  },
];
