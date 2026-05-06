export interface Niche {
  slug: string;
  name: string;
  roleLabel: string;
  /** Lease starting price — smallest markets. Actual price scales with traffic/lead volume. */
  leasePriceFrom: number;
  /** Lead price range — varies by city size and market demand */
  leadPriceRange: { min: number; max: number };
}

export const NICHES: Niche[] = [
  { slug: "roofing",      name: "Roofing",               roleLabel: "roofer",                   leasePriceFrom: 800,  leadPriceRange: { min: 45,  max: 150 } },
  { slug: "landscaping",  name: "Landscaping",            roleLabel: "landscaper",               leasePriceFrom: 400,  leadPriceRange: { min: 25,  max: 75  } },
  { slug: "hvac",         name: "HVAC",                   roleLabel: "HVAC technician",          leasePriceFrom: 600,  leadPriceRange: { min: 35,  max: 110 } },
  { slug: "plumbing",     name: "Plumbing",               roleLabel: "plumber",                  leasePriceFrom: 500,  leadPriceRange: { min: 30,  max: 95  } },
  { slug: "electrical",   name: "Electrical",             roleLabel: "electrician",              leasePriceFrom: 450,  leadPriceRange: { min: 28,  max: 85  } },
  { slug: "painting",     name: "Painting",               roleLabel: "painter",                  leasePriceFrom: 300,  leadPriceRange: { min: 18,  max: 55  } },
  { slug: "fencing",      name: "Fencing",                roleLabel: "fence contractor",         leasePriceFrom: 250,  leadPriceRange: { min: 15,  max: 50  } },
  { slug: "concrete",     name: "Concrete & Driveways",   roleLabel: "concrete contractor",      leasePriceFrom: 350,  leadPriceRange: { min: 20,  max: 65  } },
  { slug: "gutters",      name: "Gutters",                roleLabel: "gutter installer",         leasePriceFrom: 200,  leadPriceRange: { min: 12,  max: 42  } },
  { slug: "solar",        name: "Solar",                  roleLabel: "solar installer",          leasePriceFrom: 1200, leadPriceRange: { min: 65,  max: 200 } },
  { slug: "pest-control", name: "Pest Control",           roleLabel: "pest control technician",  leasePriceFrom: 180,  leadPriceRange: { min: 10,  max: 35  } },
  { slug: "cleaning",     name: "Cleaning",               roleLabel: "cleaning professional",    leasePriceFrom: 150,  leadPriceRange: { min: 8,   max: 28  } },
  { slug: "windows",      name: "Windows & Doors",        roleLabel: "window installer",         leasePriceFrom: 380,  leadPriceRange: { min: 22,  max: 70  } },
  { slug: "garage-doors", name: "Garage Doors",           roleLabel: "garage door technician",   leasePriceFrom: 220,  leadPriceRange: { min: 14,  max: 48  } },
  { slug: "flooring",     name: "Flooring",               roleLabel: "flooring contractor",      leasePriceFrom: 320,  leadPriceRange: { min: 20,  max: 62  } },
];

export const NICHE_MAP: Record<string, Niche> = Object.fromEntries(
  NICHES.map((n) => [n.slug, n])
);

export function getNiche(slug: string): Niche | undefined {
  return NICHE_MAP[slug];
}
