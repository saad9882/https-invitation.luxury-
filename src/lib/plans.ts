export type PlanId = "essential" | "premium" | "excellence" | "save_the_date";

export interface PlanFeatures {
  languages: number;
  revisionRounds: number;
  maxBlocks: number | null; // null = unlimited
  allowVideoSplash: boolean;
  allowVenueVideo: boolean;
  allowCustomMusic: boolean;
  allowCustomBlockImages: boolean;
  allowFullTypography: boolean;
  directDesignerContact: boolean;
  bespokeFromScratch: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  bullets: string[];
  extrasIncluded?: string[];
  mostPopular?: boolean;
  features: PlanFeatures;
}

export const PLANS: Record<PlanId, Plan> = {
  save_the_date: {
    id: "save_the_date",
    name: "Save the Date",
    price: 75,
    tagline: "Carte Save the Date Haute Définition avec PDF vectoriel prêt à imprimer",
    bullets: [
      "Format HD 13x18 cm (5x7 pouces)",
      "Fichier PDF vectoriel prêt à imprimer",
      "Personnalisation des couleurs & polices",
      "Téléchargement instantané après paiement",
    ],
    features: {
      languages: 1,
      revisionRounds: 1,
      maxBlocks: 1,
      allowVideoSplash: false,
      allowVenueVideo: false,
      allowCustomMusic: false,
      allowCustomBlockImages: false,
      allowFullTypography: true,
      directDesignerContact: false,
      bespokeFromScratch: false,
    },
  },
  essential: {
    id: "essential",
    name: "Essential",
    price: 175,
    tagline: "Wedding invitation",
    bullets: [
      "Choose 1 of 15 templates",
      "Your colors & info applied",
      "Free personalized envelope and seal",
      "RSVP included",
      "2 languages included (any language of the world)",
      "2 design revision rounds + unlimited info rounds",
    ],
    features: {
      languages: 2,
      revisionRounds: 2,
      maxBlocks: 3,
      allowVideoSplash: false,
      allowVenueVideo: false,
      allowCustomMusic: false,
      allowCustomBlockImages: false,
      allowFullTypography: false,
      directDesignerContact: false,
      bespokeFromScratch: false,
    },
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 575,
    tagline: "Also perfect for birthdays, events & celebrations",
    bullets: [
      "Everything in Essential",
      "Template redesigned to your style",
      "Full invitation personalization",
      "Custom icons, typography & illustrations",
      "Unlimited blocks",
      "4 revision rounds",
      "Direct contact with your personal designer",
    ],
    extrasIncluded: ["Illustration", "Video", "Music", "Seal"],
    mostPopular: true,
    features: {
      languages: 2,
      revisionRounds: 4,
      maxBlocks: null,
      allowVideoSplash: true,
      allowVenueVideo: true,
      allowCustomMusic: true,
      allowCustomBlockImages: true,
      allowFullTypography: true,
      directDesignerContact: true,
      bespokeFromScratch: false,
    },
  },
  excellence: {
    id: "excellence",
    name: "Excellence",
    price: 975,
    tagline: "100% bespoke design from scratch with editorial art direction",
    bullets: [
      "100% custom design from scratch",
      "Editorial art direction",
      "We recreate your physical invitation in digital",
      "Personal concierge support",
      "Priority support with under-24h response",
      "Everything in Premium",
    ],
    features: {
      languages: 2,
      revisionRounds: 4,
      maxBlocks: null,
      allowVideoSplash: true,
      allowVenueVideo: true,
      allowCustomMusic: true,
      allowCustomBlockImages: true,
      allowFullTypography: true,
      directDesignerContact: true,
      bespokeFromScratch: true,
    },
  },
};

export function isValidPlanId(value: string | null): value is PlanId {
  return value === "essential" || value === "premium" || value === "excellence";
}