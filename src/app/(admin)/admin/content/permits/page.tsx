'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CheckSquare, Edit3, Search, Loader2 } from 'lucide-react'
import AdminCard from '@/components/admin/AdminCard'
import SideModal from '@/components/admin/SideModal'
import { apiFetch } from '@/lib/api'
import PermitForm from './PermitForm'

export default function PermitsAdminPage() {
  const router = useRouter()
  const [permits, setPermits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchPermits = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/content/permits')
      const data = await res.json()
      if (data.permits) {
        setPermits(data.permits)
      } else if (Array.isArray(data)) {
        setPermits(data)
      } else if (data.data) {
        setPermits(data.data)
      }
    } catch (error) {
      console.error('Error fetching permits:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermits()
  }, [])

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    fetchPermits()
  }

  const handleEdit = (permit: any) => {
    router.push(`/admin/content/permits/${permit.id}`)
  }

  const filtered = search
    ? permits.filter(p => p.state?.toLowerCase().includes(search.toLowerCase()))
    : permits

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Permit Guides</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>Manage ILP and RAP requirements across states.</p>
        </div>
        <button onClick={handleCreate} className="admin-btn admin-btn-primary">
          <Plus size={14} /> Add Permit Guide
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input type="text" className="admin-input" placeholder="Search permits..." style={{ paddingLeft: '2rem' }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', padding: '4rem 2rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px dashed var(--admin-border-standard)' }}>
          <CheckSquare size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--admin-text-main)' }}>No Permit Guides</h3>
          <p style={{ color: 'var(--admin-text-subtle)', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>Document regulations to help travelers visit restricted areas.</p>
          <button onClick={handleCreate} className="admin-btn admin-btn-secondary">
            <Plus size={14} /> Add Permit Guide
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((permit) => (
            <AdminCard
              key={permit.id || Math.random()}
              title={permit.state}
              badge={permit.permit_type?.toUpperCase() || 'PERMIT'}
              icon={CheckSquare}
              onClick={() => handleEdit(permit)}
              description={permit.who_needs_it || 'No details specified.'}
              meta={`Time: ${permit.processing_time || 'N/A'}`}
              footer={
                <button onClick={() => handleEdit(permit)} className="admin-btn admin-btn-primary">
                  <Edit3 size={12} /> Edit Guide
                </button>
              }
            />
          ))}
        </div>
      )}

      <SideModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Add Permit Guide"
      >
        <PermitForm 
          onSuccess={handleCreateSuccess} 
          onCancel={() => setIsCreateModalOpen(false)} 
        />
      </SideModal>
    </div>
  )
}
