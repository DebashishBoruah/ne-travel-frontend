'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const res = await apiFetch('/api/content/festivals')
        if (res.ok) {
          const data = await res.json()
          setFestivals(data)
        }
      } catch (e) {
        console.error('Failed to fetch festivals:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchFestivals()
  }, [])

  return (
    <div className="container section">
      <div className="section-header">
        <h1 className="section-title">🎭 Festival Calendar</h1>
        <p className="section-subtitle">Experience the living traditions and vibrant celebrations of Northeast India</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div>Loading festivals...</div>
        ) : festivals.map((f, i) => (
          <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--color-saffron-400), var(--color-saffron-600))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '1rem', textAlign: 'center' }}>
              <Calendar size={20} />
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginTop: '0.25rem' }}>{f.month}</span>
            </div>
            <div className="card-body" style={{ padding: '1rem 1.5rem' }}>
              <div className="flex justify-between items-center mb-2">
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{f.name}</h3>
                <span className="badge badge-primary">{f.state}</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: '0.5rem', lineHeight: 1.6 }}>{f.description}</p>
              {f.cultural_significance && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-saffron-700)', fontWeight: 500 }}>✨ {f.cultural_significance}</p>}
              <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 500, marginTop: '0.5rem' }}>
                View packages for this festival <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
