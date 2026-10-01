export type TemplateTier = "essential" | "premium";

export interface TemplateSummary {
  id: string;
  name: string;
  tier: TemplateTier;
  phoneImage: string;
  cardImage: string;
  envelopeImage: string;
  demoUrl: string | null;
  description?: string;
  tag?: string;
}

export interface SaveTheDateTemplate {
  id: string;
  name: string;
  description: string;
  phoneImage: string;
  tag?: string;
  price: number;
}

const DEFAULT_ENVELOPE_FALLBACK = "/image/luxury_envelope_bg.png";

const IMAGE_POOL = [
  "/image/wedding-hero.png",
  "/image/wedding-palette.png",
  "/image/wedding-rsvp-dashboard.png",
  "/image/wedding-wax-seal.png",
];

const TEMPLATES_RAW = [
  {
    id: "template_3",
    name: "Majestueux",
    tier: "essential" as const,
    demoUrl: "/demos/template_3/index.html",
    tag: "ÉLÉGANT",
    description:
      "Un design majestueux conçu pour marquer les esprits dès la première seconde. Finitions d'une grande finesse.",
    envelopeImage: "/demos/template_3/assets/download.jfif",
    phoneImage: "/demos/template_3/assets/display.png",
  },
  {
    id: "template_1",
    name: "Romance à la Française",
    tier: "essential" as const,
    demoUrl: "/demos/template_1/index.html",
    tag: "ROMANTIQUE",
    description:
      "Une invitation romantique inspirée par la Ville Lumière, agrémentée de détails floraux et d'une architecture classique.",
    envelopeImage: "/demos/template_1/assets/download.jfif",
    phoneImage: "/demos/template_1/welcome1.png",
  },
  {
    id: "template2",
    name: "Moderne Épuré",
    tier: "essential" as const,
    demoUrl: "/demos/template2/index.html",
    tag: "MODERNE",
    description:
      "Un style épuré et contemporain associant typographie raffinée et lignes architecturales légères.",
    envelopeImage: "/demos/template2/assets/download.jfif",
    phoneImage: "/demos/template2/assets/front.png",
  },
];

export const TEMPLATES: TemplateSummary[] = TEMPLATES_RAW.map((t, i) => ({
  ...t,
  phoneImage: t.phoneImage,
  cardImage: t.phoneImage, // use phone image as fallback for loading errors
  envelopeImage: t.envelopeImage || DEFAULT_ENVELOPE_FALLBACK,
}));

export const SAVE_THE_DATES: SaveTheDateTemplate[] = [
  {
    id: "bridgerton",
    name: "Charme Régence (Bridgerton)",
    description: "Draperies d'or baroque, colonnes théâtrales et bouquets de fleurs sur toile crème princière.",
    phoneImage: "/demos/save-the-dates/bridgerton.png",
    tag: "BRIDGERTON",
    price: 75,
  },
  {
    id: "france",
    name: "Château de France",
    description: "Médaillon baroque aux deux cygnes majestueux sur fond de paysage champêtre romantique.",
    phoneImage: "/demos/save-the-dates/france.png",
    tag: "FRANCE",
    price: 75,
  },
  {
    id: "muslim",
    name: "Palais Oriental (Muslim)",
    description: "Architectures d'arches sculptées royales, rinceaux dorés et fleurs de lotus délicates.",
    phoneImage: "/demos/save-the-dates/muslim.png",
    tag: "MUSLIM",
    price: 75,
  },
  {
    id: "global",
    name: "Universel Botanique (Global)",
    description: "Lampions suspendus aquarelle, colonne en pierre de taille et nénuphars en fleurs.",
    phoneImage: "/demos/save-the-dates/global.png",
    tag: "GLOBAL",
    price: 75,
  },
];

export function getTemplateById(id: string): TemplateSummary | undefined {
  const mainTemplate = TEMPLATES.find((t) => t.id === id);
  if (mainTemplate) return mainTemplate;

  const stdTemplate = SAVE_THE_DATES.find((s) => s.id === id);
  if (stdTemplate) {
    return {
      id: stdTemplate.id,
      name: stdTemplate.name,
      tier: "essential",
      phoneImage: stdTemplate.phoneImage,
      cardImage: "/demos/template_3/assets/display.png",
      envelopeImage: stdTemplate.phoneImage,
      demoUrl: "/demos/template_3/index.html",
      description: stdTemplate.description,
      tag: stdTemplate.tag,
    };
  }

  return undefined;
}