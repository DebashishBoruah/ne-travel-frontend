'use client'

import { useState, useEffect } from 'react'
import { DollarSign, RefreshCw, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayouts()
  }, [])

  async function fetchPayouts() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/payments/payouts')
      if (!res.ok) throw new Error('Failed to fetch payouts')
      const data = await res.json()
      setPayouts(data)
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalPaid = payouts
    .filter(p => p.payout_status === 'paid')
    .reduce((sum, p) => sum + p.total_amount, 0)
    
  const processing = payouts
    .filter(p => p.payout_status === 'processing')
    .reduce((sum, p) => sum + p.total_amount, 0)

  const pending = payouts
    .filter(p => p.payout_status === 'pending')
    .reduce((sum, p) => sum + p.total_amount, 0)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Payout Management</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>Manage and trigger payouts via Razorpay Route</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: '#059669' },
          { label: 'Processing', value: `₹${processing.toLocaleString('en-IN')}`, color: '#d97706' },
          { label: 'Pending', value: `₹${pending.toLocaleString('en-IN')}`, color: '#6b7280' },
        ].map((s, i) => (
          <div key={i} className="admin-card-modern" style={{ padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card-modern">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border-standard)', background: '#fafafa' }}>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking ID</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontFamily: 'monospace', fontSize: '10px', color: '#9ca3af' }}>#{p.id.slice(0, 8)}</td>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>{p.operator?.name || p.homestay?.owner?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <span className="admin-badge" style={{
                      background: p.operator_id ? '#ecfdf5' : '#fef3c7',
                      color: p.operator_id ? '#065f46' : '#92400e',
                      border: `1px solid ${p.operator_id ? '#a7f3d0' : '#fde68a'}`,
                    }}>
                      {p.operator_id ? 'Operator' : 'Owner'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', textAlign: 'right' }}>₹{p.total_amount.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    <span className="admin-badge" style={{
                      background: p.payout_status === 'paid' ? '#ecfdf5' : p.payout_status === 'processing' ? '#fffbeb' : '#f3f4f6',
                      color: p.payout_status === 'paid' ? '#065f46' : p.payout_status === 'processing' ? '#92400e' : '#6b7280',
                      border: `1px solid ${p.payout_status === 'paid' ? '#a7f3d0' : p.payout_status === 'processing' ? '#fde68a' : '#e5e7eb'}`,
                    }}>
                      {p.payout_status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem' }}>
                    {p.payout_status === 'pending' && (
                      <button className="admin-btn admin-btn-primary"><DollarSign size={14} /> Trigger</button>
                    )}
                    {p.payout_status === 'processing' && (
                      <button className="admin-btn admin-btn-secondary"><RefreshCw size={14} /> Refresh</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payouts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-subtle)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
              No payouts found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
