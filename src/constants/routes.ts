/**
 * Application route path constants.
 * Use these instead of hardcoded strings to prevent typos and ease refactoring.
 */
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',

  // Tourist
  TOURIST_HOME: '/',
  DESTINATIONS: '/destinations',
  DESTINATION: (slug: string) => `/destinations/${slug}`,
  FESTIVALS: '/festivals',
  HOMEPAGE: '/',
  PACKAGES: '/packages',
  PACKAGE: (slug: string) => `/packages/${slug}`,
  HOMESTAYS: '/homestays',
  HOMESTAY: (slug: string) => `/homestays/${slug}`,
  OPERATORS: '/operators',
  PERMITS: '/permits',
  ITINERARY_BUILDER: '/itinerary-builder',
  BOOKING: '/booking',
  PROFILE: '/profile',

  // Host
  HOST_DASHBOARD: '/host',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_APPROVALS: '/admin/approvals',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_PAYOUTS: '/admin/payouts',
} as const
