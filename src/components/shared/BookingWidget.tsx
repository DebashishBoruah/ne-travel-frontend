'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

interface BookingWidgetProps {
  packageId?: string
  homestayId?: string
  operatorId?: string
  price: number
  itemName: string
  operatorName: string
  operatorPhone?: string
}

export function BookingWidget({
  packageId,
  homestayId,
  operatorId,
  price,
  itemName,
  operatorName,
  operatorPhone
}: BookingWidgetProps) {
  const router = useRouter()
  const [datesStart, setDatesStart] = useState('')
  const [groupSize, setGroupSize] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!datesStart) throw new Error('Please select a starting date.')

      // Calculate end date based on some default logic, or assume 7 days for packages
      const startDate = new Date(datesStart)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 7) // Assumed duration for simplicity

      const totalAmount = price * groupSize

      // 1. Create the booking entry
      const bookingRes = await apiFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: packageId,
          homestay_id: homestayId,
          operator_id: operatorId,
          dates_start: startDate.toISOString(),
          dates_end: endDate.toISOString(),
          group_size: groupSize,
          total_amount: totalAmount,
          message: message,
        }),
      })

      const bookingData = await bookingRes.json()

      if (!bookingRes.ok) {
        throw new Error(bookingData.error || 'Failed to create booking')
      }

      // 2. Trigger notification
      await apiFetch('/api/notifications/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourist_name: 'Tourist', // Ideally fetched from auth session or profile
          dates: startDate.toISOString().split('T')[0],
          nights: 7,
          operator_phone: operatorPhone || '+910000000000',
        }),
      }).catch(err => console.error('Notification failed to send:', err)) // Non-blocking

      // 3. Redirect to confirmation
      router.push(`/booking/confirmation?booking_id=${bookingData.booking.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ position: 'sticky', top: 80 }}>
      <form onSubmit={handleBooking} className="card-body" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>₹{price.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}> /person</span>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Select Start Date</label>
          <input
            type="date"
            className="form-input"
            value={datesStart}
            onChange={(e) => setDatesStart(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Group Size</label>
          <select
            className="form-input form-select"
            value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Message to Operator</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Any special requirements..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={{ padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', fontSize: 'var(--font-size-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>{itemName} ({groupSize} {groupSize === 1 ? 'person' : 'people'})</span>
            <span>₹{(price * groupSize).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            <span>Total</span>
            <span>₹{(price * groupSize).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-accent btn-lg w-full">
          {loading ? 'Processing...' : 'Request to Book'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          You won&apos;t be charged yet
        </p>
      </form>
    </div>
  )
}
