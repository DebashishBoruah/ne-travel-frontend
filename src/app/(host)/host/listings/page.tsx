'use client'

import { useState, useEffect } from 'react'
import { Plus, Home, MapPin, Edit3, Search, Loader2, ImageIcon } from 'lucide-react'
import SideModal from '@/components/admin/SideModal'
import { apiFetch } from '@/lib/api'
import HomestayForm from './HomestayForm'

export default function HostListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [search, setSearch] = useState('')

  const fetchListings = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/host/listings')
      const data = await res.json()
      setListings(Array.isArray(data) ? data : data.listings || data.data || [])
    } catch {
      console.error('Failed to fetch listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  const openCreate = () => { setEditData(null); setModalOpen(true) }
  const openEdit = (item: any) => { setEditData(item); setModalOpen(true) }
  const handleSuccess = () => { setModalOpen(false); setEditData(null); fetchListings() }

  const filtered = search
    ? listings.filter((l) =>
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.state?.toLowerCase().includes(search.toLowerCase())
      )
    : listings

  const statusClass = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'approved':
      case 'published': return 'admin-content-card-status--published'
      case 'pending':
      case 'pending_approval': return 'admin-content-card-status--pending'
      case 'rejected': return 'admin-content-card-status--rejected'
      default: return 'admin-content-card-status--draft'
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>
            My Homestays
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
            Manage your listed homestay properties.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="admin-btn admin-btn-primary" style={{ background: '#6366f1' }}>
          <Plus size={14} /> Add Homestay
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input
            type="text"
            className="admin-input"
            placeholder="Search listings..."
            style={{ paddingLeft: '2rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <Loader2 size={24} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <Home size={40} className="admin-empty-state-icon" />
          <h3 className="admin-empty-state-title">No Homestays Yet</h3>
          <p className="admin-empty-state-desc">List your first property to start welcoming travellers.</p>
          <button type="button" onClick={openCreate} className="admin-btn admin-btn-secondary">
            <Plus size={14} /> Add Your First Homestay
          </button>
        </div>
      ) : (
        <div className="admin-card-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="admin-content-card"
              style={{ cursor: 'pointer' }}
              onClick={() => openEdit(item)}
            >
              <div className="admin-content-card-img">
                {item.hero_image ? (
                  <img src={item.hero_image} alt={item.name} />
                ) : (
                  <div className="admin-content-card-img-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
                {item.status && (
                  <span className={`admin-content-card-status ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                )}
                {item.state && (
                  <span className="admin-content-card-badge">{item.state}</span>
                )}
              </div>

              <div className="admin-content-card-body">
                <div className="admin-content-card-title">{item.name || 'Untitled'}</div>
                <div className="admin-content-card-sub">
                  <MapPin size={11} />
                  {item.district || item.state || 'Location unlisted'}
                </div>
                <div className="admin-content-card-desc">
                  {item.description || 'No description provided.'}
                </div>
                <div className="admin-content-card-footer">
                  <span className="admin-content-card-meta">
                    {item.rooms ? `${item.rooms} room${item.rooms > 1 ? 's' : ''}` : ''}
                    {item.price ? ` · ₹${item.price}/night` : ''}
                  </span>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    onClick={(e) => { e.stopPropagation(); openEdit(item) }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Modal */}
      <SideModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null) }}
        title={editData ? 'Edit Homestay' : 'Add Homestay'}
      >
        {modalOpen && (
          <HomestayForm
            initialData={editData}
            onSuccess={handleSuccess}
            onCancel={() => { setModalOpen(false); setEditData(null) }}
          />
        )}
      </SideModal>
    </div>
  )
}
