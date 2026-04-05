'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Phone, ArrowRight } from 'lucide-react'
import { PaymentWidget } from '@/components/shared/PaymentWidget'
import { Suspense } from 'react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id') || 'BK-DEMO-123'
  const amount = 25000

  return (
    <div className="container section" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div className="t-confirm-icon">
        <CheckCircle size={40} />
      </div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Booking Requested!</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
        Your request (ID: {bookingId}) has been sent. Pay now to secure your spot.
      </p>

      <div className="t-info-card" style={{ padding: '1.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Booking Summary</h3>
        <div className="t-confirm-summary-row">
          <span className="t-confirm-summary-label">Booking ID</span>
          <span className="t-confirm-summary-value">{bookingId}</span>
        </div>
        <div className="t-confirm-summary-row">
          <span className="t-confirm-summary-label">Operator</span>
          <span className="t-confirm-summary-value">NE Adventures</span>
        </div>
        <div className="t-confirm-summary-row t-confirm-total">
          <span className="t-confirm-summary-label">Total Amount</span>
          <span className="t-confirm-summary-value">₹{amount.toLocaleString('en-IN')}</span>
        </div>

        <PaymentWidget
          amount={amount}
          bookingId={bookingId}
          operatorAmount={24000}
          homestayAmount={0}
        />
      </div>

      <div className="t-callout info" style={{ textAlign: 'left' }}>
        <div className="t-callout-title" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Phone size={14} /> Contact Operator
        </div>
        <a
          href="https://wa.me/910000000000"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}
        >
          WhatsApp Support <ArrowRight size={14} />
        </a>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <Link href="/profile" className="btn btn-outline">Go to My Bookings</Link>
        <Link href="/packages" className="btn btn-ghost">Browse More</Link>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="loading-center"><div className="spinner" /></div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
