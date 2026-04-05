'use client'

import { useState, useCallback } from 'react'
import { apiFetch } from '@/lib/api'
import type { Booking } from '@/types'

interface CreateBookingPayload {
  package_id?: string
  homestay_id?: string
  operator_id?: string
  dates_start: string
  dates_end: string
  group_size: number
  total_amount: number
  message?: string
}

interface UseBookingReturn {
  loading: boolean
  error: string | null
  booking: Booking | null
  createBooking: (payload: CreateBookingPayload) => Promise<Booking | null>
  updateBookingStatus: (bookingId: string, status: string) => Promise<Booking | null>
  clearError: () => void
}

/**
 * Hook for creating and managing bookings from client components.
 */
export function useBooking(): UseBookingReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const createBooking = useCallback(async (payload: CreateBookingPayload): Promise<Booking | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to create booking')
        return null
      }
      setBooking(json.data.booking)
      return json.data.booking
    } catch (err) {
      setError('Network error. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBookingStatus = useCallback(async (bookingId: string, status: string): Promise<Booking | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, status }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to update booking')
        return null
      }
      setBooking(json.data.booking)
      return json.data.booking
    } catch (err) {
      setError('Network error. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, error, booking, createBooking, updateBookingStatus, clearError }
}
