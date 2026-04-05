'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Package, MapPin, Edit3, Search, Loader2, ImageIcon, Clock, Users } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import SideModal from '@/components/admin/SideModal'
import PackageForm from './PackageForm'

export default function OperatorPackagesPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/packages')
      const data = await res.json()
      setPackages(Array.isArray(data) ? data : data.packages || data.data || [])
    } catch {
      console.error('Failed to fetch packages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPackages() }, [])

  const openCreate = () => setModalOpen(true)
  const handleFormSuccess = () => {
    setModalOpen(false)
    fetchPackages()
  }

  const filtered = search
    ? packages.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.state?.toLowerCase().includes(search.toLowerCase())
      )
    : packages

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
            My Packages
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>
            Manage your tour packages and experiences.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="admin-btn admin-btn-primary" style={{ background: '#059669' }}>
          <Plus size={14} /> New Package
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input
            type="text"
            className="admin-input"
            placeholder="Search packages..."
            style={{ paddingLeft: '2rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <Loader2 size={24} style={{ color: '#059669', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <Package size={40} className="admin-empty-state-icon" />
          <h3 className="admin-empty-state-title">No Packages Yet</h3>
          <p className="admin-empty-state-desc">Create your first tour package to start attracting travellers.</p>
          <button type="button" onClick={openCreate} className="admin-btn admin-btn-secondary">
            <Plus size={14} /> Create Your First Package
          </button>
        </div>
      ) : (
        <div className="admin-card-grid">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="admin-content-card"
              style={{ cursor: 'pointer' }}
            >
              <div className="admin-content-card-img">
                {pkg.photos?.[0] ? (
                  <img src={pkg.photos[0]} alt={pkg.name} />
                ) : (
                  <div className="admin-content-card-img-placeholder">
                    <ImageIcon size={32} />
                  </div>
                )}
                {pkg.status && (
                  <span className={`admin-content-card-status ${statusClass(pkg.status)}`}>
                    {pkg.status}
                  </span>
                )}
                {(pkg.homestay?.state || pkg.state) && (
                  <span className="admin-content-card-badge">{pkg.homestay?.state || pkg.state}</span>
                )}
              </div>

              <div className="admin-content-card-body">
                <div className="admin-content-card-title">{pkg.name || 'Untitled Package'}</div>
                <div className="admin-content-card-sub">
                  <MapPin size={11} />
                  {pkg.homestay?.state || pkg.state || 'Northeast India'}
                </div>
                <div className="admin-content-card-desc">
                  {pkg.description || 'No description provided.'}
                </div>
                <div className="admin-content-card-footer">
                  <span className="admin-content-card-meta">
                    {pkg.duration_days && <><Clock size={11} /> {pkg.duration_days}d</>}
                    {pkg.max_group_size && <> · <Users size={11} /> Max {pkg.max_group_size}</>}
                    {pkg.total_price && <> · ₹{pkg.total_price.toLocaleString('en-IN')}</>}
                  </span>
                  <Link
                    href={`/host/packages/${pkg.id || pkg.slug}`}
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: 'none' }}
                  >
                    <Edit3 size={12} /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Tour Package"
      >
        {modalOpen && (
          <PackageForm
            variant="modal"
            onSuccess={handleFormSuccess}
            onCancel={() => setModalOpen(false)}
          />
        )}
      </SideModal>
    </div>
  )
}
