'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, ArrowRight, Calendar } from 'lucide-react'
import { NE_STATES } from '@/lib/types'
import { apiFetch } from '@/lib/api'

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await apiFetch('/api/content/destinations')
        if (res.ok) setDestinations(await res.json())
      } catch (e) {
        console.error('Failed to fetch destinations:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const filtered = destinations.filter((d) => {
    const matchesState = selectedState === 'all' || d.state === selectedState
    const matchesSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.state?.toLowerCase().includes(search.toLowerCase())
    return matchesState && matchesSearch
  })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Explore Destinations</h1>
          <p className="page-hero-sub">
            Discover hidden gems across the 8 states of Northeast India
          </p>
          <div className="page-hero-search">
            <Search size={18} className="page-hero-search-icon" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="page-hero-search-input"
            />
          </div>
        </div>
      </div>

      {/* Filter bar — full width strip */}
      <div className="listing-filter-strip">
        <div className="container listing-filter-inner">
          <div className="listing-filters">
            <button
              className={`listing-chip${selectedState === 'all' ? ' active' : ''}`}
              onClick={() => setSelectedState('all')}
            >
              All States
            </button>
            {NE_STATES.map((state) => (
              <button
                key={state}
                className={`listing-chip${selectedState === state ? ' active' : ''}`}
                onClick={() => setSelectedState(state)}
              >
                {state}
              </button>
            ))}
          </div>
          {!loading && (
            <span className="listing-count">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Results */}
      <section className="container listing-page">
        {loading ? (
          <div className="listing-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="listing-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="listing-empty">
            <MapPin size={48} strokeWidth={1} />
            <h3>No destinations found</h3>
            <p>
              {search
                ? `No results for "${search}". Try a different search.`
                : selectedState !== 'all'
                  ? `No destinations in ${selectedState} yet.`
                  : 'Destinations will appear here once published.'}
            </p>
            {(search || selectedState !== 'all') && (
              <button className="listing-empty-reset" onClick={() => { setSearch(''); setSelectedState('all') }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="listing-grid">
            {filtered.map((dest) => (
              <Link href={`/destinations/${dest.slug}`} key={dest.slug} className="listing-card">
                <div className="listing-card-img">
                  {dest.image ? (
                    <img src={dest.image} alt={dest.title} />
                  ) : (
                    <div className="listing-card-img-fallback">
                      <MapPin size={28} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="listing-card-img-overlay" />
                  <span className="listing-card-badge">{dest.state}</span>
                </div>
                <div className="listing-card-body">
                  <h3 className="listing-card-title">{dest.title}</h3>
                  <p className="listing-card-desc">{dest.description || 'Explore this stunning destination in Northeast India.'}</p>
                  <div className="listing-card-footer">
                    {dest.best_season || dest.bestSeason ? (
                      <span className="listing-card-meta">
                        <Calendar size={13} /> Best: {dest.best_season || dest.bestSeason}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="listing-card-link">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
