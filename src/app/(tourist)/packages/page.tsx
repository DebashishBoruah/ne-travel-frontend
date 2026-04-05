'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, ArrowRight, Clock, Star, Users } from 'lucide-react'
import { NE_STATES } from '@/lib/types'
import { apiFetch } from '@/lib/api'

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await apiFetch('/api/packages')
        if (res.ok) setPackages(await res.json())
      } catch (e) {
        console.error('Failed to fetch packages:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const filtered = packages.filter((p) => {
    const state = p.homestay?.state || p.state || ''
    const matchesState = selectedState === 'all' || state === selectedState
    const matchesSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase())
    return matchesState && matchesSearch
  })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">Tour Packages</h1>
          <p className="page-hero-sub">
            Curated multi-day experiences across Northeast India, led by local operators
          </p>
          <div className="page-hero-search">
            <Search size={18} className="page-hero-search-icon" />
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="page-hero-search-input"
            />
          </div>
        </div>
      </div>

      <div className="listing-filter-strip">
        <div className="container listing-filter-inner">
          <div className="listing-filters">
            <button className={`listing-chip${selectedState === 'all' ? ' active' : ''}`} onClick={() => setSelectedState('all')}>All</button>
            {NE_STATES.map((s) => (
              <button key={s} className={`listing-chip${selectedState === s ? ' active' : ''}`} onClick={() => setSelectedState(s)}>{s}</button>
            ))}
          </div>
          {!loading && <span className="listing-count">{filtered.length} package{filtered.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>

      <section className="container listing-page">
        {loading ? (
          <div className="listing-grid">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="listing-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="listing-empty">
            <MapPin size={48} strokeWidth={1} />
            <h3>No packages found</h3>
            <p>
              {search
                ? `No results for "${search}".`
                : selectedState !== 'all'
                  ? `No packages in ${selectedState} yet.`
                  : 'Tour packages will appear here once published.'}
            </p>
            {(search || selectedState !== 'all') && (
              <button className="listing-empty-reset" onClick={() => { setSearch(''); setSelectedState('all') }}>Clear filters</button>
            )}
          </div>
        ) : (
          <div className="listing-grid">
            {filtered.map((pkg) => (
              <Link href={`/packages/${pkg.slug || pkg.id}`} key={pkg.id} className="listing-card">
                <div className="listing-card-img">
                  {pkg.photos?.[0] ? (
                    <img src={pkg.photos[0]} alt={pkg.name} />
                  ) : (
                    <div className="listing-card-img-fallback">
                      <MapPin size={28} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="listing-card-img-overlay" />
                  <span className="listing-card-badge">{pkg.homestay?.state || pkg.state || 'NE India'}</span>
                  {pkg.rating && (
                    <span className="listing-card-rating">
                      <Star size={12} fill="currentColor" /> {pkg.rating}
                    </span>
                  )}
                </div>
                <div className="listing-card-body">
                  <h3 className="listing-card-title">{pkg.name}</h3>
                  <p className="listing-card-desc">{pkg.description || 'A curated multi-day travel experience in Northeast India.'}</p>
                  <div className="listing-card-tags">
                    {pkg.duration_days && (
                      <span className="listing-card-tag"><Clock size={10} /> {pkg.duration_days} days</span>
                    )}
                    {pkg.max_group_size && (
                      <span className="listing-card-tag"><Users size={10} /> Max {pkg.max_group_size}</span>
                    )}
                  </div>
                  <div className="listing-card-footer">
                    <div className="listing-card-price">
                      <span className="listing-card-price-amount">₹{(pkg.total_price || pkg.price || 0).toLocaleString('en-IN')}</span>
                      <span className="listing-card-price-unit">/person</span>
                    </div>
                    <span className="listing-card-link">View <ArrowRight size={14} /></span>
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
