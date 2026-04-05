'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Filter } from 'lucide-react'
import { NE_STATES } from '@/lib/types'

import { apiFetch } from '@/lib/api'
import { useEffect } from 'react'

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>('all')

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await apiFetch('/api/content/destinations')
        if (res.ok) {
          const data = await res.json()
          setDestinations(data)
        }
      } catch (e) {
        console.error('Failed to fetch destinations:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const filtered = selectedState === 'all'
    ? destinations
    : destinations.filter((d) => d.state === selectedState)

  return (
    <div className="container section">
      <div className="section-header">
        <h1 className="section-title">Explore Destinations</h1>
        <p className="section-subtitle">Discover hidden gems across the 8 states of Northeast India</p>
      </div>

      {/* State Filter */}
      <div className="filter-bar">
        <Filter size={18} />
        <button
          className={`filter-chip ${selectedState === 'all' ? 'filter-chip--active' : ''}`}
          onClick={() => setSelectedState('all')}
        >
          All States
        </button>
        {NE_STATES.map((state) => (
          <button
            key={state}
            className={`filter-chip ${selectedState === state ? 'filter-chip--active' : ''}`}
            onClick={() => setSelectedState(state)}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="grid-cards mt-6">
        {loading ? (
          <div>Loading destinations...</div>
        ) : filtered.map((dest) => (
          <Link href={`/destinations/${dest.slug}`} key={dest.slug} className="card dest-list-card">
            <div className="dest-list-image">
              <div className="dest-list-placeholder">
                <MapPin size={32} />
              </div>
            </div>
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <span className="badge badge-primary">{dest.state}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>
                  Best: {dest.best_season || dest.bestSeason}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                {dest.title}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                {dest.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No destinations found in {selectedState}. Check back soon!</p>
        </div>
      )}

      <style jsx>{`
        .filter-bar {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
          padding: var(--space-4) 0;
        }

        .filter-chip {
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-sm);
          font-weight: 500;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: white;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .filter-chip:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-chip--active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        .dest-list-card {
          transition: transform var(--transition-base);
        }

        .dest-list-card:hover {
          transform: translateY(-4px);
        }

        .dest-list-image {
          height: 180px;
          overflow: hidden;
        }

        .dest-list-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-forest-100), var(--color-forest-200));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-forest-400);
        }
      `}</style>
    </div>
  )
}
