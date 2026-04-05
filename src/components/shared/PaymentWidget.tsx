'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

interface PaymentWidgetProps {
  amount: number
  bookingId: string
  operatorAmount?: number
  homestayAmount?: number
}

export function PaymentWidget({ amount, bookingId, operatorAmount, homestayAmount }: PaymentWidgetProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setError('Payment gateway is still loading. Please try again in a moment.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Create order on our Express backend
      const res = await apiFetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          booking_id: bookingId,
          operator_amount: operatorAmount,
          homestay_owner_amount: homestayAmount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment')
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Northeast Travel Platform',
        description: `Payment for booking ${bookingId}`,
        order_id: data.order.id,
        handler: function (response: any) {
          // On success verify/capture is handled via webhook
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`)
          router.push('/profile')
        },
        prefill: {
          name: 'Tourist Guest',
          email: 'tourist@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#1b5e20', // var(--color-primary)
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        setError(`Payment failed: ${response.error.description}`)
      })

      rzp.open()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <button 
        onClick={handlePayment} 
        disabled={loading || !scriptLoaded} 
        className="btn btn-primary btn-lg w-full"
      >
        {loading ? 'Initializing Secure Payment...' : `Pay ₹${amount.toLocaleString('en-IN')} Now`}
      </button>
      <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginTop: '0.75rem' }}>
        Secured by Razorpay
      </p>
    </div>
  )
}
