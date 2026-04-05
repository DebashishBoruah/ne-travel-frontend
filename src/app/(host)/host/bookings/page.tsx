'use client'

import { useState, useEffect } from 'react'
import { Inbox, Calendar, Users, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface Booking {
  id: string
  tourist: string
  phone?: string
  dates: string
  guests: number
  amount: number
  message?: string
  status: 'pending' | 'confirmed' | 'declined' | 'completed'
}

const DEMO_BOOKINGS: Booking[] = [
  { id: '1', tourist: 'Rahul Sharma',  phone: '+91 98765 43210', dates: '15–21 Dec 2024', guests: 2, amount: 50000, message: 'Looking forward to exploring Meghalaya!', status: 'pending' },
  { id: '2', tourist: 'Priya Patel',   phone: '+91 87654 32100', dates: '20–23 Dec 2024', guests: 4, amount: 18000, message: 'Family with two kids. Is the trail kid-friendly?', status: 'confirmed' },
  { id: '3', tourist: 'John Smith',    phone: '+91 76543 21000', dates: '25–30 Dec 2024', guests: 3, amount: 75000, message: 'Would love to experience local cuisine.', status: 'pending' },
  { id: '4', tourist: 'Ananya Das',    phone: '+91 65432 10000', dates: '1–5 Jan 2025',   guests: 2, amount: 30000, status: 'declined' },
  { id: '5', tourist: 'Mike Chen',     phone: '+91 54321 09876', dates: '10–15 Jan 2025',  guests: 6, amount: 90000, message: 'Group of friends, all adventure lovers!', status: 'confirmed' },
]

const FILTERS = ['all', 'pending', 'confirmed', 'declined'] as const

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)
  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>
          Bookings
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
          Manage incoming booking requests and reservations.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-btn admin-btn-sm${filter === f ? '' : ' admin-btn-ghost'}`}
            style={filter === f ? { background: '#6366f1', color: '#fff', border: 'none' } : {}}
          >
            <span style={{ textTransform: 'capitalize' }}>{f}</span>
            {f === 'pending' && pendingCount > 0 && (
              <span style={{
                background: filter === 'pending' ? 'rgba(255,255,255,0.25)' : '#fef3c7',
                color: filter === 'pending' ? '#fff' : '#b45309',
                fontSize: '0.625rem',
                fontWeight: 700,
                padding: '0.0625rem 0.375rem',
                borderRadius: 9999,
                marginLeft: '0.125rem',
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table or empty */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Loader2 size={24} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <Inbox size={40} className="admin-empty-state-icon" />
          <h3 className="admin-empty-state-title">No Bookings</h3>
          <p className="admin-empty-state-desc">
            {filter !== 'all' ? `No ${filter} bookings at the moment.` : 'You don\u2019t have any bookings yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking: b }: { booking: Booking }) {
  const statusStyle: Record<string, { bg: string; color: string }> = {
    pending:   { bg: '#fffbeb', color: '#b45309' },
    confirmed: { bg: '#ecfdf5', color: '#047857' },
    declined:  { bg: '#fef2f2', color: '#b91c1c' },
    completed: { bg: '#eef2ff', color: '#4338ca' },
  }
  const s = statusStyle[b.status] || statusStyle.pending

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--admin-border-standard)',
      borderRadius: '0.5rem',
      padding: '1rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="host-table-avatar">{b.tourist.charAt(0)}</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>{b.tourist}</div>
            {b.phone && (
              <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-subtle)' }}>{b.phone}</div>
            )}
          </div>
        </div>
        <span style={{
          padding: '0.15rem 0.625rem',
          borderRadius: 9999,
          fontSize: '0.6875rem',
          fontWeight: 700,
          textTransform: 'capitalize',
          background: s.bg,
          color: s.color,
        }}>
          {b.status}
        </span>
      </div>

      {/* Info strip */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '0.625rem 0',
        borderTop: '1px solid var(--admin-border-subtle)',
        borderBottom: b.message ? '1px solid var(--admin-border-subtle)' : 'none',
        fontSize: '0.8125rem',
        color: 'var(--admin-text-subtle)',
        flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Calendar size={13} /> {b.dates}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Users size={13} /> {b.guests} guest{b.guests > 1 ? 's' : ''}
        </span>
        <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
          ₹{b.amount.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Message */}
      {b.message && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--admin-text-subtle)',
          fontStyle: 'italic',
          lineHeight: 1.5,
          padding: '0.5rem 0.75rem',
          background: '#f9fafb',
          borderRadius: 'var(--admin-radius)',
        }}>
          &ldquo;{b.message}&rdquo;
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-placeholder)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={11} /> Booking #{b.id}
        </span>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {b.status === 'pending' ? (
            <>
              <button className="admin-btn admin-btn-sm" style={{ background: '#6366f1', color: '#fff', border: 'none' }}>
                <CheckCircle size={13} /> Confirm
              </button>
              <button className="admin-btn admin-btn-sm admin-btn-danger">
                <XCircle size={13} /> Decline
              </button>
            </>
          ) : (
            <button className="admin-btn admin-btn-sm admin-btn-secondary">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
