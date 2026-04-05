'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Loader2, Calendar, Home, Box, Search, Filter } from 'lucide-react'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(data)
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
    </div>
  )

  const statuses = ['all', 'pending', 'confirmed', 'declined', 'completed']

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>All Bookings</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>Platform-wide booking overview and management</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 3,
          background: '#f3f4f6',
          borderRadius: '0.375rem',
          border: '1px solid var(--admin-border-standard)',
        }}>
          {statuses.map(s => (
            <button 
              key={s} 
              onClick={() => setStatusFilter(s)} 
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s',
                background: statusFilter === s ? '#fff' : 'transparent',
                color: statusFilter === s ? 'var(--admin-text-main)' : 'var(--admin-text-subtle)',
                boxShadow: statusFilter === s ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
            <input 
              type="text" 
              placeholder="Filter bookings..." 
              className="admin-input" 
              style={{ paddingLeft: '2rem', width: 200 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card-modern">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border-standard)', background: '#fafafa' }}>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tourist</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dates</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontFamily: 'monospace', fontSize: '10px', color: '#9ca3af' }}>#{b.id.slice(0, 8)}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.8125rem' }}>{b.tourist?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}>{b.tourist?.email}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {b.package_id ? <Box size={12} style={{ color: '#3b82f6' }} /> : <Home size={12} style={{ color: '#f59e0b' }} />}
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)' }}>{b.package?.name || b.homestay?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--admin-text-main)' }}>
                      <Calendar size={12} style={{ color: '#9ca3af' }} />
                      {new Date(b.dates_start).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>₹{b.total_amount.toLocaleString('en-IN')}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <span className="admin-badge" style={{
                      background: b.status === 'confirmed' ? '#ecfdf5' : b.status === 'pending' ? '#fffbeb' : b.status === 'declined' ? '#fef2f2' : '#f3f4f6',
                      color: b.status === 'confirmed' ? '#065f46' : b.status === 'pending' ? '#92400e' : b.status === 'declined' ? '#991b1b' : '#6b7280',
                      border: `1px solid ${b.status === 'confirmed' ? '#a7f3d0' : b.status === 'pending' ? '#fde68a' : b.status === 'declined' ? '#fecaca' : '#e5e7eb'}`,
                    }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-subtle)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
              No bookings match your current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
