/**
 * App-wide configuration constants.
 * Values sourced from environment variables where applicable.
 */
export const APP_CONFIG = {
  /** Number of items per page for listings/packages pagination */
  PAGE_SIZE: 12,

  /** Platform booking fee in INR */
  PLATFORM_FEE_INR: 200,

  /** Default map center for NE India (Guwahati) */
  DEFAULT_MAP_CENTER: { lat: 26.1445, lng: 91.7362 } as const,

  /** Default map zoom level */
  DEFAULT_MAP_ZOOM: 7,

  /** Backend API base URL */
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',

  /** Supported image MIME types for upload */
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,

  /** Max upload file size in bytes (5 MB) */
  MAX_UPLOAD_SIZE_BYTES: 5 * 1024 * 1024,
} as const
