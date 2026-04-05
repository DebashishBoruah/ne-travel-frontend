'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CalendarDays, Edit3, Search, Loader2 } from 'lucide-react'
import AdminCard from '@/components/admin/AdminCard'
import SideModal from '@/components/admin/SideModal'
import { apiFetch } from '@/lib/api'
import FestivalForm from './FestivalForm'

export default function FestivalsAdminPage() {
  const router = useRouter()
  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchFestivals = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/content/festivals')
      const data = await res.json()
      if (data.festivals) {
        setFestivals(data.festivals)
      } else if (Array.isArray(data)) {
        setFestivals(data)
      } else if (data.data) {
        setFestivals(data.data)
      }
    } catch (error) {
      console.error('Error fetching festivals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFestivals()
  }, [])

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    fetchFestivals()
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/content/festivals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchFestivals()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleEdit = (fest: any) => {
    router.push(`/admin/content/festivals/${fest.id || fest.slug}`)
  }

  const filtered = search
    ? festivals.filter(f => f.name?.toLowerCase().includes(search.toLowerCase()) || f.state?.toLowerCase().includes(search.toLowerCase()))
    : festivals

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Cultural Festivals</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>Manage cultural celebrations and dates.</p>
        </div>
        <button onClick={handleCreate} className="admin-btn admin-btn-primary">
          <Plus size={14} /> Add Festival
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input type="text" className="admin-input" placeholder="Search festivals..." style={{ paddingLeft: '2rem' }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', padding: '4rem 2rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px dashed var(--admin-border-standard)' }}>
          <CalendarDays size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--admin-text-main)' }}>No Festivals Yet</h3>
          <p style={{ color: 'var(--admin-text-subtle)', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>Get started by capturing the rich culture of Northeast India.</p>
          <button onClick={handleCreate} className="admin-btn admin-btn-secondary">
            <Plus size={14} /> Add Festival
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((fest) => (
            <AdminCard
              key={fest.id || fest.slug || Math.random()}
              title={fest.name}
              image={fest.hero_image}
              badge={fest.state}
              status={fest.status}
              tags={fest.tags}
              onStatusChange={(status) => handleStatusChange(fest.id, status)}
              icon={CalendarDays}
              onClick={() => handleEdit(fest)}
              description={fest.description || 'No description provided.'}
              meta={`Month: ${fest.month}`}
              footer={
                <button onClick={() => handleEdit(fest)} className="admin-btn admin-btn-primary">
                  <Edit3 size={12} /> Edit Details
                </button>
              }
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <SideModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          title="Add New Festival"
        >
          <FestivalForm 
            onSuccess={handleCreateSuccess} 
            onCancel={() => setIsCreateModalOpen(false)} 
          />
        </SideModal>
      )}
    </div>
  )
}
