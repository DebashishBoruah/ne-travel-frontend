'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Phone, ArrowRight } from 'lucide-react'
import { PaymentWidget } from '@/components/shared/PaymentWidget'
import { Suspense } from 'react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id') || 'BK-DEMO-123'
  
  // In a real app, you would fetch the booking details from Supabase here
  // For this integration demo, we'll use the IDs from the URL
  const amount = 25000 // Fixed for demo, would be booking.total_amount

  return (
    <div className="container section" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-forest-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-success)' }}>
        <CheckCircle size={40} />
      </div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>Booking Requested! 🎉</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Your request (ID: {bookingId}) has been sent. Pay now to secure your spot.</p>

      <div className="card" style={{ padding: '1.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '1rem' }}>Booking Summary</h3>
        <div style={{ fontSize: 'var(--font-size-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="flex justify-between"><span style={{ color: 'var(--color-text-light)' }}>Booking ID</span><span style={{ fontWeight: 600 }}>{bookingId}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--color-text-light)' }}>Operator</span><span style={{ fontWeight: 600 }}>NE Adventures</span></div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.25rem' }} className="flex justify-between">
            <span style={{ fontWeight: 700 }}>Total Amount</span><span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' }}>₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <PaymentWidget 
          amount={amount} 
          bookingId={bookingId} 
          operatorAmount={24000} 
          homestayAmount={0} 
        />
      </div>

      <div className="card" style={{ padding: '1rem', background: 'var(--color-forest-50)', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Contact Operator</p>
        <a href="https://wa.me/910000000000" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem', fontSize: 'var(--font-size-sm)' }}>
          WhatsApp Support <ArrowRight size={14} />
        </a>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/profile" className="btn btn-outline">Go to My Bookings</Link>
        <Link href="/packages" className="btn btn-ghost">Browse More</Link>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
