'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DestinationForm from '../DestinationForm'
import DestinationPreview from '@/components/admin/previews/DestinationPreview'
import { apiFetch } from '@/lib/api'
import { ArrowLeft, Edit3, Eye, Check, X, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditDestinationPage() {
  const router = useRouter()
  const { id } = useParams()
  const [destination, setDestination] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')

  useEffect(() => {
    if (id) {
      const fetchDestination = async () => {
        try {
          const res = await apiFetch(`/api/content/destinations/${id}`)
          const data = await res.json()
          
          if (res.ok && (data.id || data.destination?.id)) {
            setDestination(data.destination || data)
          } else {
            setDestination(null)
          }
        } catch (error) {
          console.error('Error fetching destination:', error)
          setDestination(null)
        } finally {
          setLoading(false)
        }
      }
      fetchDestination()
    }
  }, [id])

  const handleSuccess = () => {
    setMode('preview')
    const fetchDestination = async () => {
      try {
        const res = await apiFetch(`/api/content/destinations/${id}`)
        const data = await res.json()
        setDestination(data.destination || data)
      } catch (error) { console.error(error) }
    }
    fetchDestination()
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/content/destinations')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
    </div>
  )

  if (!destination) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--admin-text-subtle)' }}>
      <ArrowLeft size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}>Destination Not Found</h2>
      <p style={{ fontSize: '0.8125rem', marginBottom: '1.5rem' }}>The destination you are looking for does not exist or has been removed.</p>
      <Link href="/admin/content/destinations" className="admin-btn admin-btn-secondary">
        <ArrowLeft size={14} /> Back to Destinations
      </Link>
    </div>
  )

  return (
    <div className="animate-fade-in">
      {/* Admin Control Bar */}
      <div 
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.75rem 0', marginBottom: '1.5rem',
          borderBottom: '1px solid var(--admin-border-standard)',
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--admin-sidebar-bg)',
          marginTop: '-1rem', // Offset page padding
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handleCancel}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0 0.5rem' }}
            title="Back to List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
              {mode === 'preview' ? 'Previewing' : 'Editing'}: {destination.title}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--admin-text-subtle)', fontFamily: 'monospace' }}>
              Asset ID: {destination.id?.slice(0, 8)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {mode === 'preview' ? (
            <>
              <a 
                href={`/destinations/${destination.slug}`} 
                target="_blank" 
                className="admin-btn admin-btn-secondary"
              >
                <ExternalLink size={14} /> Public View
              </a>
              <button 
                onClick={() => setMode('edit')}
                className="admin-btn admin-btn-primary"
              >
                <Edit3 size={14} /> Edit Content
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setMode('preview')}
                className="admin-btn admin-btn-secondary"
              >
                <X size={14} /> Cancel
              </button>
              {/* Note: The Save button is usually inside the form, but let's keep it here for layout if needed */}
              {/* Actually, form-level submit usually works better. But for UI, let's just use buttons. */}
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {mode === 'preview' ? (
          <DestinationPreview data={destination} />
        ) : (
          <div className="admin-card-modern">
            <div className="admin-card-body" style={{ padding: '1.5rem' }}>
              <DestinationForm 
                initialData={destination}
                onSuccess={handleSuccess} 
                onCancel={() => setMode('preview')} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
