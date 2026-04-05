import { format, parseISO, differenceInDays, isAfter, isBefore } from 'date-fns'

/**
 * Format a date string for display.
 * @example formatDate('2024-03-15') → 'Mar 15, 2024'
 */
export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

/**
 * Format a date range for display.
 * @example formatDateRange('2024-03-15', '2024-03-20') → 'Mar 15 – Mar 20, 2024'
 */
export function formatDateRange(startStr: string, endStr: string): string {
  const start = parseISO(startStr)
  const end = parseISO(endStr)
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
}

/**
 * Number of nights between two date strings (inclusive of start, exclusive of end).
 */
export function countNights(startStr: string, endStr: string): number {
  return differenceInDays(parseISO(endStr), parseISO(startStr))
}

/**
 * Returns true if the given date string is in the past.
 */
export function isPastDate(dateStr: string): boolean {
  return isBefore(parseISO(dateStr), new Date())
}

/**
 * Returns true if the given date string is in the future.
 */
export function isFutureDate(dateStr: string): boolean {
  return isAfter(parseISO(dateStr), new Date())
}
