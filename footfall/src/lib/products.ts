export type ProductCategoryId =
  | "experiences"
  | "display"
  | "systems"
  | "furniture";

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: ProductCategoryId;
  /** Daily rental rate in AED (placeholder — update when final rates arrive) */
  dailyRateAed: number;
  icon: string;
};

export type ProductCategory = {
  id: ProductCategoryId;
  title: string;
  subtitle: string;
};

export const productCategories: ProductCategory[] = [
  {
    id: "experiences",
    title: "Signature Experiences",
    subtitle: "Crowd-stopping activations that create queues and shareable moments",
  },
  {
    id: "display",
    title: "Display & Media",
    subtitle: "Screens, LED walls, lighting and content that own the room",
  },
  {
    id: "systems",
    title: "Event Systems",
    subtitle: "Capture, control and convert footfall with smart event tech",
  },
  {
    id: "furniture",
    title: "Furniture & Infrastructure",
    subtitle: "Premium seating, tables, barricades and on-site consultation",
  },
];

export const products: Product[] = [
  {
    id: "giant-claw",
    name: "Giant Claw Machine",
    description: "Landmark claw experience for all events",
    categoryId: "experiences",
    dailyRateAed: 4500,
    icon: "claw",
  },
  {
    id: "walking-led",
    name: "Walking LED Billboard Bags",
    description: "Mobile digital media that moves with the crowd",
    categoryId: "experiences",
    dailyRateAed: 2800,
    icon: "led-bag",
  },
  {
    id: "custom-mascot",
    name: "Custom Mascot",
    description: "Branded character walkabout for activations",
    categoryId: "experiences",
    dailyRateAed: 2200,
    icon: "mascot",
  },
  {
    id: "plush-toys",
    name: "Custom Plush Toys",
    description: "Branded plush giveaways and prizes",
    categoryId: "experiences",
    dailyRateAed: 900,
    icon: "plush",
  },
  {
    id: "touch-tvs",
    name: "43\" Touch Screen TVs on Stands",
    description: "Interactive kiosks ready for the floor",
    categoryId: "display",
    dailyRateAed: 1200,
    icon: "touch",
  },
  {
    id: "indoor-led",
    name: "Indoor LED Walls",
    description: "High-impact indoor LED display walls",
    categoryId: "display",
    dailyRateAed: 5500,
    icon: "led-wall",
  },
  {
    id: "led-content",
    name: "Content for LED",
    description: "Custom motion content built for LED surfaces",
    categoryId: "display",
    dailyRateAed: 1800,
    icon: "content",
  },
  {
    id: "exhibition-lights",
    name: "Exhibition Lights with Dimmer",
    description: "Professional show lighting with dimmer control",
    categoryId: "display",
    dailyRateAed: 950,
    icon: "lights",
  },
  {
    id: "ptz-cams",
    name: "PTZ Cams & Controllers",
    description: "PTZ cameras with normal and video controllers",
    categoryId: "systems",
    dailyRateAed: 1600,
    icon: "camera",
  },
  {
    id: "wrist-bands",
    name: "Wrist Bands",
    description: "Access and engagement wristband systems",
    categoryId: "systems",
    dailyRateAed: 650,
    icon: "wristband",
  },
  {
    id: "crowd-tabs",
    name: "Tabs + Crowd Control Software",
    description: "Tablets with custom crowd-control software",
    categoryId: "systems",
    dailyRateAed: 2100,
    icon: "tablet",
  },
  {
    id: "cueing",
    name: "Cueing Systems",
    description: "Queue and cue management for smooth flow",
    categoryId: "systems",
    dailyRateAed: 1400,
    icon: "cue",
  },
  {
    id: "qr-registration",
    name: "QR Registration Systems",
    description: "Custom QR registration and check-in flows",
    categoryId: "systems",
    dailyRateAed: 1750,
    icon: "qr",
  },
  {
    id: "barricades",
    name: "Barricades",
    description: "Crowd control barriers for safe flow",
    categoryId: "furniture",
    dailyRateAed: 400,
    icon: "barricade",
  },
  {
    id: "cocktail-tables",
    name: "Cocktail Tables & High Leather Chairs",
    description: "Exhibition cocktail tables with premium seating",
    categoryId: "furniture",
    dailyRateAed: 850,
    icon: "cocktail",
  },
  {
    id: "single-chairs",
    name: "Single Seater Chairs",
    description: "Comfortable single-seat event chairs",
    categoryId: "furniture",
    dailyRateAed: 350,
    icon: "chair",
  },
  {
    id: "elite-tables",
    name: "Elite Tables",
    description: "Premium elite tables for VIP zones",
    categoryId: "furniture",
    dailyRateAed: 1100,
    icon: "table",
  },
  {
    id: "consultations",
    name: "Consultations",
    description: "Concept and activation consulting sessions",
    categoryId: "furniture",
    dailyRateAed: 2500,
    icon: "consult",
  },
];

export const eventTypes = [
  "Exhibition / Trade Show",
  "Corporate Activation",
  "Mall / Retail Experience",
  "Product Launch",
  "Conference / Summit",
  "Festival / Outdoor Event",
  "Private / VIP Event",
  "Other",
] as const;

export type ServiceScope = "local" | "international";

/** UAE VAT */
export const UAE_VAT_RATE = 0.05;

/** Fallback fees when API is offline */
export const serviceFees = {
  local: {
    transportPerDay: 350,
    laborPerDay: 450,
    setupFlat: 600,
    crewPerDay: 500,
    cargoFlat: 0,
    customsHandlingFlat: 0,
  },
  international: {
    transportPerDay: 900,
    laborPerDay: 750,
    setupFlat: 1200,
    crewPerDay: 850,
    cargoFlat: 3500,
    customsHandlingFlat: 800,
  },
} as const;

export type ServiceFeeRates = {
  transportPerDay: number;
  laborPerDay: number;
  setupFlat: number;
  crewPerDay: number;
  cargoFlat?: number;
  customsHandlingFlat?: number;
};

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function productsByCategory(categoryId: ProductCategoryId) {
  return products.filter((p) => p.categoryId === categoryId);
}

export function formatAed(amount: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export type BookingQuoteInput = {
  productId: string;
  days: number;
  scope: ServiceScope;
  fees?: ServiceFeeRates;
};

export type BookingQuote = {
  rental: number;
  transport: number;
  labor: number;
  setup: number;
  crew: number;
  cargo: number;
  customs: number;
  subtotal: number;
  tax: number;
  total: number;
};

export function calculateBookingQuote({
  productId,
  days,
  scope,
  fees: feesOverride,
}: BookingQuoteInput): BookingQuote {
  const product = getProductById(productId);
  const safeDays = Math.max(1, days);
  const rental = (product?.dailyRateAed ?? 0) * safeDays;
  const fallback = serviceFees[scope];
  const fees = {
    transportPerDay: feesOverride?.transportPerDay ?? fallback.transportPerDay,
    laborPerDay: feesOverride?.laborPerDay ?? fallback.laborPerDay,
    setupFlat: feesOverride?.setupFlat ?? fallback.setupFlat,
    crewPerDay: feesOverride?.crewPerDay ?? fallback.crewPerDay,
    cargoFlat: feesOverride?.cargoFlat ?? fallback.cargoFlat ?? 0,
    customsHandlingFlat:
      feesOverride?.customsHandlingFlat ?? fallback.customsHandlingFlat ?? 0,
  };

  const transport = fees.transportPerDay * safeDays;
  const labor = fees.laborPerDay * safeDays;
  const setup = fees.setupFlat;
  const crew = fees.crewPerDay * safeDays;
  const cargo = scope === "international" ? fees.cargoFlat : 0;
  const customs = scope === "international" ? fees.customsHandlingFlat : 0;
  const subtotal = rental + transport + labor + setup + crew + cargo + customs;
  const tax = subtotal * UAE_VAT_RATE;

  return {
    rental,
    transport,
    labor,
    setup,
    crew,
    cargo,
    customs,
    subtotal,
    tax,
    total: subtotal + tax,
  };
}
