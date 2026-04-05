// ─── Database / Supabase types ───────────────────────────────────────────────
export type UserRole = 'tourist' | 'operator' | 'homestay_owner' | 'admin'
export type ListingStatus = 'pending_approval' | 'approved' | 'rejected'
export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed'
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed'
export type PermitStatus = 'applied' | 'processing' | 'approved' | 'rejected'
export type TargetType = 'listing' | 'package'

export interface BankDetails {
  account_holder: string
  account_number: string
  ifsc_code: string
  upi_id?: string
}

export interface User {
  id: string
  phone: string | null
  email: string | null
  role: UserRole
  name: string | null
  bio: string | null
  avatar_url: string | null
  bank_details: BankDetails | null
  created_at: string
}

export interface GeoJSON {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export interface Listing {
  id: string
  owner_id: string
  name: string
  location_geojson: GeoJSON | null
  state: string
  rooms: number
  price_per_night: number
  max_guests: number
  amenities: string[]
  photos: string[]
  languages: string[]
  bank_details: BankDetails | null
  status: ListingStatus
  slug: string
  description?: string
  created_at: string
  owner?: User
  reviews?: Review[]
}

export interface Package {
  id: string
  operator_id: string
  homestay_id: string | null
  name: string
  description: string
  itinerary: string | null
  photos: string[]
  total_price: number
  duration_days: number
  max_group_size: number
  includes_guide: boolean
  includes_transport: boolean
  includes_permits: boolean
  status: ListingStatus
  slug: string
  created_at: string
  operator?: User
  homestay?: Listing
  reviews?: Review[]
}

export interface Availability {
  id: string
  listing_id: string
  date: string
  is_blocked: boolean
  booking_id: string | null
}

export interface Booking {
  id: string
  tourist_id: string
  package_id: string | null
  homestay_id: string | null
  operator_id: string | null
  dates_start: string
  dates_end: string
  group_size: number
  total_amount: number
  platform_fee: number
  status: BookingStatus
  payout_status: PayoutStatus
  razorpay_order_id: string | null
  message: string | null
  created_at: string
  tourist?: User
  package?: Package
  homestay?: Listing
  operator?: User
}

export interface Review {
  id: string
  booking_id: string
  tourist_id: string
  target_id: string
  target_type: TargetType
  rating: number
  text: string
  created_at: string
  tourist?: User
}

export interface Permit {
  id: string
  tourist_id: string
  state: string
  permit_type: string
  application_ref: string | null
  status: PermitStatus
  notes: string | null
  created_at: string
}

export interface FestivalAlert {
  id: string
  festival_name: string
  state: string
  date: string
  sanity_article_id: string | null
}
