'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, Home, Package, Loader2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface PendingItem {
  id: string
  type: 'listing' | 'package'
  name: string
  owner_name: string
  state: string
  price_display: string
  submitted: string
  data: any
}

export default function ApprovalsPage() {
  const [items, setItems] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApprovals()
  }, [])

  async function fetchApprovals() {
    setLoading(true)
    setError('')
    try {
      const [listRes, pkgRes] = await Promise.all([
        apiFetch('/api/listings/pending'),
        apiFetch('/api/packages/pending')
      ])

      if (!listRes.ok || !pkgRes.ok) throw new Error('Failed to fetch pending items')

      const listings = await listRes.json()
      const packages = await pkgRes.json()

      const combined: PendingItem[] = [
        ...listings.map((l: any) => ({
          id: l.id,
          type: 'listing' as const,
          name: l.name,
          owner_name: l.owner?.name || 'Unknown',
          state: l.state,
          price_display: `₹${l.price_per_night}/night`,
          submitted: new Date(l.created_at).toLocaleDateString(),
          data: l
        })),
        ...packages.map((p: any) => ({
          id: p.id,
          type: 'package' as const,
          name: p.name,
          owner_name: p.operator?.name || 'Unknown',
          state: p.homestay?.state || 'N/A',
          price_display: `₹${p.total_price}/person`,
          submitted: new Date(p.created_at).toLocaleDateString(),
          data: p
        }))
      ]

      setItems(combined)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, type: 'listing' | 'package', status: 'approved' | 'rejected') => {
    try {
      const endpoint = type === 'listing' ? `/api/listings/${id}/status` : `/api/packages/${id}/status`
      const res = await apiFetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error(`Failed to ${status} item`)
      
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Approval Queue</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>{items.length} items pending review</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(item => (
          <div key={item.id} className="admin-card-modern" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: 36, height: 36, borderRadius: '0.375rem', 
                  background: item.type === 'listing' ? '#fef3c7' : '#ecfdf5', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: item.type === 'listing' ? '#92400e' : '#065f46',
                  flexShrink: 0,
                }}>
                  {item.type === 'listing' ? <Home size={16} /> : <Package size={16} />}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--admin-text-main)' }}>{item.name}</p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--admin-text-subtle)' }}>by {item.owner_name} · {item.state}</p>
                </div>
              </div>
              <span className="admin-badge" style={{
                background: item.type === 'listing' ? '#fef3c7' : '#ecfdf5',
                color: item.type === 'listing' ? '#92400e' : '#065f46',
                border: `1px solid ${item.type === 'listing' ? '#fde68a' : '#a7f3d0'}`,
              }}>
                {item.type}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--admin-text-subtle)', flexWrap: 'wrap' }}>
              <span>💰 {item.price_display}</span>
              {item.type === 'listing' && <span>🛏 {item.data.rooms} rooms · {item.data.max_guests} guests</span>}
              {item.type === 'package' && <span>📅 {item.data.duration_days} days</span>}
              <span>📷 {item.data.photos?.length || 0} photos</span>
              <span>📆 Submitted {item.submitted}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button className="admin-btn admin-btn-primary" onClick={() => handleAction(item.id, item.type, 'approved')}>
                <CheckCircle size={14} /> Approve
              </button>
              <button className="admin-btn admin-btn-secondary" style={{ color: '#dc2626' }} onClick={() => handleAction(item.id, item.type, 'rejected')}>
                <XCircle size={14} /> Reject
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                <Eye size={14} /> {expandedId === item.id ? 'Hide' : 'View'}
              </button>
            </div>

            {expandedId === item.id && (
              <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem', fontSize: '0.8125rem', border: '1px solid var(--admin-border-subtle)' }}>
                <p style={{ color: 'var(--admin-text-main)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{item.data.description}</p>
                {item.data.photos?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {item.data.photos.map((url: string, i: number) => (
                      <img key={i} src={url} alt="Photo" style={{ height: 80, borderRadius: '0.375rem', border: '1px solid var(--admin-border-standard)' }} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--admin-text-subtle)' }}>
          <CheckCircle size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '0.25rem' }}>All caught up!</h3>
          <p style={{ fontSize: '0.8125rem' }}>No items pending review.</p>
        </div>
      )}
    </div>
  )
}
