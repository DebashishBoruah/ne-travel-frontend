import { APP_CONFIG } from '@/constants/config'

/** Returns true if the value is a non-empty string. */
export function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Validates an Indian mobile number (10 digits, starts with 6-9). */
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

/** Validates an IFSC code (4 alpha + 0 + 6 alphanumeric). */
export function isValidIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())
}

/** Returns true if the file type is an accepted image MIME type. */
export function isValidImageType(mimeType: string): boolean {
  return (APP_CONFIG.ACCEPTED_IMAGE_TYPES as readonly string[]).includes(mimeType)
}

/** Returns true if the file size is within the allowed upload limit. */
export function isValidFileSize(sizeBytes: number): boolean {
  return sizeBytes <= APP_CONFIG.MAX_UPLOAD_SIZE_BYTES
}

/** Returns true if start date is strictly before end date. */
export function isValidDateRange(start: string, end: string): boolean {
  return new Date(start) < new Date(end)
}

/** Returns true if group size is a positive integer. */
export function isValidGroupSize(size: number): boolean {
  return Number.isInteger(size) && size >= 1
}
