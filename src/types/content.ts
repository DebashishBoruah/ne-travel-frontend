// ─── Sanity CMS document types ───────────────────────────────────────────────

export interface SanityDestination {
  _id: string
  title: string
  state: string
  slug: string
  hero_image: string
  description: string
  cultural_context?: string
  tribal_history?: string
  best_season?: string
  permit_required?: boolean
  map_coordinates?: { lat: number; lng: number }
}

export interface SanityFestival {
  _id: string
  name: string
  state: string
  month: number
  slug: string
  hero_image: string
  description: string
  cultural_significance?: string
  how_to_attend?: string
}

export interface SanityArticle {
  _id: string
  title: string
  slug: string
  category: 'destination' | 'festival' | 'culture' | 'permit'
  body: string
  hero_image: string
  published_at: string
  author: string
}

export interface SanityPermitGuide {
  _id: string
  state: string
  permit_type: string
  who_needs_it: string
  how_to_apply: string
  documents_required: string[]
  processing_time: string
  updated_at: string
}
