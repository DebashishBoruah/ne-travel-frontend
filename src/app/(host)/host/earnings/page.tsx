'use client'

import { useState } from 'react'
import { TrendingUp, CheckCircle, Clock, Building2 } from 'lucide-react'
import { TextField, Button } from '@/components/admin/ui'

interface Payout {
  id: string
  booking: string
  amount: number
  date: string
  status: 'paid' | 'pending' | 'processing'
}

const DEMO_PAYOUTS: Payout[] = [
  { id: '1', booking: 'Rahul Sharma — 7 Days Meghalaya',          amount: 14300, date: '22 Dec 2024', status: 'paid' },
  { id: '2', booking: 'Priya Patel — Khasi Cottage (3 nights)',   amount: 4500,  date: '24 Dec 2024', status: 'pending' },
  { id: '3', booking: 'Mike Chen — 5 Day Nagaland',               amount: 35000, date: '17 Jan 2025', status: 'processing' },
  { id: '4', booking: 'John Smith — 5 Days Meghalaya',            amount: 22000, date: '1 Jan 2025',  status: 'pending' },
]

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  paid:       { bg: '#ecfdf5', color: '#047857' },
  pending:    { bg: '#fffbeb', color: '#b45309' },
  processing: { bg: '#eef2ff', color: '#4338ca' },
}

export default function EarningsPage() {
  const [payouts] = useState<Payout[]>(DEMO_PAYOUTS)

  const totalEarned = 145000
  const paidAmount  = 83500
  const pendingAmount = 61500

  const stats = [
    { label: 'Total Earnings', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Paid Out',       value: `₹${paidAmount.toLocaleString('en-IN')}`,  icon: <CheckCircle size={20} />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Pending',        value: `₹${pendingAmount.toLocaleString('en-IN')}`, icon: <Clock size={20} />,     color: '#f59e0b', bg: '#fffbeb' },
  ]

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>
          Earnings
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
          Track your revenue and payout history.
        </p>
      </div>

      {/* Stat cards */}
      <div className="host-stat-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((s) => (
          <div key={s.label} className="host-stat-card">
            <div className="host-stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="host-stat-value">{s.value}</div>
              <div className="host-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Payout History */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '0.75rem' }}>
          Payout History
        </h2>
        <div className="host-table-wrap">
          <table className="host-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => {
                const st = STATUS_STYLE[p.status] || STATUS_STYLE.pending
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.booking}</td>
                    <td style={{ fontWeight: 600 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td>{p.date}</td>
                    <td>
                      <span className="host-status-badge" style={{ background: st.bg, color: st.color }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Details */}
      <div className="admin-form-section">
        <div className="admin-form-section-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={14} /> Bank Details
        </div>
        <div className="admin-form-section-body">
          <div className="admin-form-row admin-form-row--2">
            <TextField label="Account Holder" name="account_holder" defaultValue="Naga Homestay LLP" />
            <TextField label="Account Number" name="account_number" defaultValue="****5678" />
          </div>
          <div className="admin-form-row admin-form-row--2">
            <TextField label="IFSC Code" name="ifsc" defaultValue="SBIN0001234" />
            <TextField label="UPI ID" name="upi" defaultValue="nagahomestay@upi" />
          </div>
          <div>
            <Button variant="primary" style={{ background: '#6366f1' }}>
              Update Bank Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
