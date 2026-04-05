'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MapPin, Edit3, Trash2, MapIcon, Search, Loader2 } from 'lucide-react'
import AdminCard from '@/components/admin/AdminCard'
import SideModal from '@/components/admin/SideModal'
import { apiFetch } from '@/lib/api'
import DestinationForm from './DestinationForm'

export default function DestinationsAdminPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/content/destinations')
      const data = await res.json()
      if (data.destinations) {
        setDestinations(data.destinations)
      } else if (Array.isArray(data)) {
        setDestinations(data)
      } else if (data.data) {
        setDestinations(data.data)
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [])

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    fetchDestinations()
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/content/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchDestinations()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleEdit = (dest: any) => {
    router.push(`/admin/content/destinations/${dest.id || dest.slug}`)
  }

  const filtered = search
    ? destinations.filter(d => d.title?.toLowerCase().includes(search.toLowerCase()) || d.state?.toLowerCase().includes(search.toLowerCase()))
    : destinations

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Destinations</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>Manage all travel destinations across Northeast India.</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={14} /> Add Destination
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input 
            type="text" 
            className="admin-input" 
            placeholder="Search destinations..." 
            style={{ paddingLeft: '2rem' }} 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', padding: '4rem 2rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px dashed var(--admin-border-standard)' }}>
          <MapPin size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--admin-text-main)' }}>No Destinations Yet</h3>
          <p style={{ color: 'var(--admin-text-subtle)', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>Get started by adding your first travel destination.</p>
          <button type="button" onClick={handleCreate} className="admin-btn admin-btn-secondary">
            <Plus size={14} /> Add Your First Destination
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((dest) => (
            <AdminCard
              key={dest.id || dest.slug}
              title={dest.title}
              image={dest.hero_image}
              badge={dest.state}
              status={dest.status}
              tags={dest.tags}
              onStatusChange={(status) => handleStatusChange(dest.id, status)}
              icon={MapIcon}
              onClick={() => handleEdit(dest)}
              subtitle={
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} />
                  <span>{dest.district || 'Location unlisted'}</span>
                </div>
              }
              description={dest.description || 'No description available for this destination.'}
              footer={
                <button 
                  onClick={() => handleEdit(dest)}
                  className="admin-btn admin-btn-primary"
                >
                  <Edit3 size={12} /> Edit Details
                </button>
              }
              meta={
                <button className="admin-btn admin-btn-secondary" style={{ color: '#dc2626', padding: '0 0.5rem' }}>
                  <Trash2 size={14} />
                </button>
              }
            />
          ))}
        </div>
      )}

      <SideModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Destination"
      >
        {isCreateModalOpen ? (
          <DestinationForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        ) : null}
      </SideModal>
    </div>
  )
}
