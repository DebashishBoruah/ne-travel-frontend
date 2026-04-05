// ─── NE India States ─────────────────────────────────────────────────────────
export const NE_STATES = [
  'Assam',
  'Meghalaya',
  'Nagaland',
  'Arunachal Pradesh',
  'Manipur',
  'Mizoram',
  'Tripura',
  'Sikkim',
] as const

export type NEState = (typeof NE_STATES)[number]

// ─── Platform constants ───────────────────────────────────────────────────────
export const PLATFORM_FEE_INR = 200

export const BOOKING_STATUSES = ['pending', 'confirmed', 'declined', 'cancelled', 'completed'] as const
export const LISTING_STATUSES = ['pending_approval', 'approved', 'rejected'] as const
export const PERMIT_STATUSES = ['applied', 'processing', 'approved', 'rejected'] as const
export const USER_ROLES = ['tourist', 'operator', 'homestay_owner', 'admin'] as const
