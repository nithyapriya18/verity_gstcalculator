export type GstCategory = {
  id: string
  label: string
  rate: number
}

export const GST_CATEGORIES: GstCategory[] = [
  { id: 'custom', label: 'Custom (manual rate)', rate: 18 },
  { id: 'essential-food', label: 'Essential food items (0%)', rate: 0 },
  { id: 'rail-transport', label: 'Rail/transport and basics (5%)', rate: 5 },
  { id: 'processed-food', label: 'Processed food and goods (12%)', rate: 12 },
  { id: 'most-services', label: 'Most goods/services (18%)', rate: 18 },
  { id: 'luxury-sin', label: 'Luxury/sin goods (28%)', rate: 28 },
]

export function getCategoryById(id: string) {
  return GST_CATEGORIES.find((c) => c.id === id) ?? GST_CATEGORIES[0]
}

