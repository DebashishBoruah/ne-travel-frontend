'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Users, Wifi, Filter } from 'lucide-react'
import { NE_STATES } from '@/lib/types'

import { apiFetch } from '@/lib/api'
import { useEffect } from 'react'

export default function HomestaysPage() {
  const [homestays, setHomestays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('all')

  useEffect(() => {
    async function fetchHomestays() {
      try {
        const res = await apiFetch('/api/listings')
        if (res.ok) {
          const data = await res.json()
          setHomestays(data)
        }
      } catch (e) {
        console.error('Failed to fetch homestays:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchHomestays()
  }, [])

  const filtered = selectedState === 'all' ? homestays : homestays.filter(h => h.state === selectedState)

  return (
    <div className="container section">
      <div className="section-header">
        <h1 className="section-title">Homestays</h1>
        <p className="section-subtitle">Stay with local families and experience authentic Northeast Indian hospitality</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button className={`filter-chip ${selectedState === 'all' ? 'active' : ''}`} onClick={() => setSelectedState('all')}>All</button>
        {NE_STATES.map(s => (
          <button key={s} className={`filter-chip ${selectedState === s ? 'active' : ''}`} onClick={() => setSelectedState(s)}>{s}</button>
        ))}
      </div>

      <div className="grid-cards">
        {loading ? (
          <div>Loading homestays...</div>
        ) : filtered.map(h => (
          <Link href={`/homestays/${h.slug}`} key={h.slug} className="card" style={{ transition: 'transform 0.2s' }}>
            <div style={{ height: 180, background: 'linear-gradient(135deg, var(--color-earth-100), var(--color-earth-200))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-earth-400)' }}>
              <MapPin size={28} />
            </div>
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <span className="badge badge-primary">{h.state}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-saffron-500)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  <Star size={14} fill="currentColor" /> {h.rating}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '0.25rem' }}>{h.name}</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                <Users size={12} style={{ display: 'inline' }} /> Up to {h.max_guests || h.maxGuests} guests · {(h.languages || []).join(', ')}
              </p>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {(h.amenities || []).map((a: string) => <span key={a} className="badge badge-neutral">{a}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>₹{(h.price_per_night || h.price).toLocaleString('en-IN')}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>/night</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .filter-chip {
          padding: 0.5rem 0.75rem;
          font-size: var(--font-size-sm);
          font-weight: 500;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: white;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .filter-chip:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .filter-chip.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
      `}</style>
    </div>
  )
}
