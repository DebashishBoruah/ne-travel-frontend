'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface Review {
  id: string
  tourist: string
  rating: number
  text: string
  date: string
  listing: string
}

const DEMO_REVIEWS: Review[] = [
  { id: '1', tourist: 'Rahul Sharma', rating: 5, text: 'Absolutely amazing experience! The living root bridge trek was unforgettable. The guide was very knowledgeable about local culture.', date: '22 Dec 2024', listing: '7 Days in Meghalaya' },
  { id: '2', tourist: 'Priya Patel',  rating: 4, text: 'Lovely homestay, great food, and the owner was very hospitable. Would have liked better WiFi though.', date: '18 Dec 2024', listing: 'Khasi Cottage Stay' },
  { id: '3', tourist: 'John Smith',   rating: 5, text: 'The Hornbill Festival experience was incredible. Well organized and the cultural immersion was authentic.', date: '10 Dec 2024', listing: 'Nagaland Tribal Trail' },
  { id: '4', tourist: 'Ananya Das',   rating: 4, text: 'Beautiful location, clean rooms, and helpful staff. The natural pool was a highlight!', date: '5 Dec 2024', listing: 'Riverside Khasi Cottage' },
  { id: '5', tourist: 'Mike Chen',    rating: 5, text: 'Best travel experience I have ever had. Northeast India is a hidden gem and this operator knows it inside out.', date: '28 Nov 2024', listing: '7 Days in Meghalaya' },
]

function Stars({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= count ? '#f59e0b' : 'none'}
          color="#f59e0b"
          strokeWidth={i <= count ? 0 : 1.5}
        />
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>(DEMO_REVIEWS)
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>
          Reviews
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
          See what travellers are saying about your properties.
        </p>
      </div>

      {/* Summary card */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--admin-border-standard)',
        borderRadius: '0.5rem',
        padding: '1.25rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        {/* Score */}
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 80 }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--admin-text-main)', lineHeight: 1 }}>
            {avg.toFixed(1)}
          </div>
          <div style={{ margin: '0.25rem 0' }}><Stars count={Math.round(avg)} size={14} /></div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-subtle)' }}>{reviews.length} reviews</div>
        </div>

        {/* Bar chart */}
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((n) => {
            const count = reviews.filter((r) => r.rating === n).length
            const pct = (count / reviews.length) * 100
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, width: 18, textAlign: 'right', color: 'var(--admin-text-subtle)' }}>
                  {n}
                </span>
                <Star size={10} fill="#f59e0b" color="#f59e0b" strokeWidth={0} />
                <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-placeholder)', width: 16 }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {reviews.map((r) => (
          <div key={r.id} style={{
            background: '#fff',
            border: '1px solid var(--admin-border-standard)',
            borderRadius: '0.5rem',
            padding: '1rem 1.25rem',
          }}>
            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: '#fffbeb', color: '#b45309',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {r.tourist.charAt(0)}
                </span>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>{r.tourist}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-subtle)' }}>{r.date} &middot; {r.listing}</div>
                </div>
              </div>
              <Stars count={r.rating} />
            </div>

            {/* Body */}
            <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', lineHeight: 1.6 }}>
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
