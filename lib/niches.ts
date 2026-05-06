export const NICHES = [
  { slug: 'roofing', name: 'Roofing', roleLabel: 'roofer', avgLeasePrice: 2400, avgLeadPrice: 85 },
  { slug: 'landscaping', name: 'Landscaping', roleLabel: 'landscaper', avgLeasePrice: 1200, avgLeadPrice: 45 },
  { slug: 'hvac', name: 'HVAC', roleLabel: 'HVAC technician', avgLeasePrice: 1800, avgLeadPrice: 65 },
  { slug: 'plumbing', name: 'Plumbing', roleLabel: 'plumber', avgLeasePrice: 1600, avgLeadPrice: 55 },
  { slug: 'electrical', name: 'Electrical', roleLabel: 'electrician', avgLeasePrice: 1400, avgLeadPrice: 50 },
  { slug: 'painting', name: 'Painting', roleLabel: 'painter', avgLeasePrice: 900, avgLeadPrice: 35 },
  { slug: 'fencing', name: 'Fencing', roleLabel: 'fence contractor', avgLeasePrice: 800, avgLeadPrice: 30 },
  { slug: 'concrete', name: 'Concrete & Driveways', roleLabel: 'concrete contractor', avgLeasePrice: 1000, avgLeadPrice: 40 },
  { slug: 'gutters', name: 'Gutters', roleLabel: 'gutter installer', avgLeasePrice: 700, avgLeadPrice: 28 },
  { slug: 'solar', name: 'Solar', roleLabel: 'solar installer', avgLeasePrice: 3200, avgLeadPrice: 120 },
  { slug: 'pest-control', name: 'Pest Control', roleLabel: 'pest control technician', avgLeasePrice: 600, avgLeadPrice: 22 },
  { slug: 'cleaning', name: 'Cleaning', roleLabel: 'cleaning professional', avgLeasePrice: 500, avgLeadPrice: 18 },
  { slug: 'windows', name: 'Windows & Doors', roleLabel: 'window installer', avgLeasePrice: 1100, avgLeadPrice: 42 },
  { slug: 'garage-doors', name: 'Garage Doors', roleLabel: 'garage door technician', avgLeasePrice: 750, avgLeadPrice: 30 },
  { slug: 'flooring', name: 'Flooring', roleLabel: 'flooring contractor', avgLeasePrice: 950, avgLeadPrice: 38 },
];

export const NICHE_MAP = Object.fromEntries(NICHES.map(n => [n.slug, n]));

export function getNiche(slug: string) {
  return NICHE_MAP[slug] ?? null;
}
