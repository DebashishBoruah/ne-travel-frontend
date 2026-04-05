'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, Search } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const res = await apiFetch('/api/content/festivals')
        if (res.ok) setFestivals(await res.json())
      } catch (e) {
        console.error('Failed to fetch festivals:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchFestivals()
  }, [])

  const filtered = festivals.filter(
    (f) => !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.state?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Festival Calendar</h1>
          <p className="page-hero-sub">
            Experience the living traditions and vibrant celebrations of Northeast India
          </p>
          <div className="page-hero-search">
            <Search size={18} className="page-hero-search-icon" />
            <input
              type="text"
              placeholder="Search festivals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="page-hero-search-input"
            />
          </div>
        </div>
      </div>

      <div className="container listing-page">
        {!loading && <div className="listing-toolbar"><span /><span className="listing-count">{filtered.length} festival{filtered.length !== 1 ? 's' : ''}</span></div>}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="listing-skeleton" style={{ height: 140 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="listing-empty">
            <Calendar size={48} strokeWidth={1} />
            <h3>No festivals found</h3>
            <p>{search ? `No results for "${search}".` : 'Festival information will appear here once added.'}</p>
          </div>
        ) : (
          <div className="fest-list">
            {filtered.map((f, i) => (
              <div key={i} className="fest-row">
                <div className="fest-row-date">
                  <span className="fest-row-month">{f.month || 'TBA'}</span>
                  <span className="fest-row-icon">{f.icon || '🎭'}</span>
                </div>
                <div className="fest-row-body">
                  <div className="fest-row-header">
                    <h3 className="fest-row-name">{f.name}</h3>
                    <span className="fest-row-state">{f.state}</span>
                  </div>
                  <p className="fest-row-desc">{f.description}</p>
                  {f.cultural_significance && (
                    <p className="fest-row-cultural">{f.cultural_significance}</p>
                  )}
                  <Link href="/packages" className="fest-row-link">
                    View related packages <ArrowRight size={13} />
                  </Link>
                </div>
                {f.image && (
                  <div className="fest-row-img">
                    <img src={f.image} alt={f.name} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
