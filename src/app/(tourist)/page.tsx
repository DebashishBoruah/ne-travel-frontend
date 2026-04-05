'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Calendar, Star, Sparkles, ArrowRight, Mountain, TreePine, Tent, Users } from 'lucide-react'
import { apiFetch } from '@/lib/api'

const NE_STATES = [
  { name: 'Arunachal Pradesh', short: 'Arunachal', icon: '🏔️', desc: 'Land of the Dawn-Lit Mountains' },
  { name: 'Assam', short: 'Assam', icon: '🦏', desc: 'Gateway to the Northeast' },
  { name: 'Manipur', short: 'Manipur', icon: '🌸', desc: 'Jewel of India' },
  { name: 'Meghalaya', short: 'Meghalaya', icon: '☁️', desc: 'Abode of the Clouds' },
  { name: 'Mizoram', short: 'Mizoram', icon: '⛰️', desc: 'Land of the Highlanders' },
  { name: 'Nagaland', short: 'Nagaland', icon: '🎭', desc: 'Land of Festivals' },
  { name: 'Sikkim', short: 'Sikkim', icon: '❄️', desc: 'The Land of Mystique' },
  { name: 'Tripura', short: 'Tripura', icon: '🏛️', desc: 'Land of Fourteen Gods' },
]

const STATS = [
  { num: '8', label: 'States', icon: <MapPin size={18} /> },
  { num: '200+', label: 'Destinations', icon: <Mountain size={18} /> },
  { num: '50+', label: 'Festivals', icon: <TreePine size={18} /> },
  { num: '1000+', label: 'Homestays', icon: <Tent size={18} /> },
]

export default function HomePage() {
  const [featuredDestinations, setFeaturedDestinations] = useState<any[]>([])
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([])
  const [featuredPackages, setFeaturedPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [destRes, festRes, pkgRes] = await Promise.all([
          apiFetch('/api/content/destinations/featured'),
          apiFetch('/api/content/festivals/upcoming'),
          apiFetch('/api/packages'),
        ])
        if (destRes.ok) setFeaturedDestinations(await destRes.json())
        if (festRes.ok) setUpcomingFestivals(await festRes.json())
        if (pkgRes.ok) setFeaturedPackages((await pkgRes.json()).slice(0, 3))
      } catch (e) {
        console.error('Failed to fetch home data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content container">
          <div className="animate-fade-in" style={{ maxWidth: 720 }}>
            <p className="hero-eyebrow">Explore Northeast India</p>
            <h1 className="hero-title">
              Where Nature Meets<br />
              <span className="hero-title-accent">Ancient Culture</span>
            </h1>
            <p className="hero-subtitle">
              Living root bridges, cloud-kissed peaks, vibrant tribal festivals, and the warmest hospitality — all waiting for you.
            </p>

            <div className="hero-cta-row">
              <Link href="/destinations" className="hero-cta-primary">
                Start Exploring <ArrowRight size={18} />
              </Link>
              <Link href="/itinerary-builder" className="hero-cta-secondary">
                <Sparkles size={16} /> Plan with AI
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-stats container animate-scale-up">
          <div className="hero-stats-bar">
            {STATS.map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-icon">{s.icon}</span>
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 States Grid ── */}
      <section className="home-section">
        <div className="container">
          <div className="home-section-header">
            <p className="home-section-eyebrow">Discover</p>
            <h2 className="home-section-title">Eight Sisters of the Northeast</h2>
            <p className="home-section-sub">Each state has a unique identity, culture, and landscape</p>
          </div>

          <div className="states-grid">
            {NE_STATES.map((state) => (
              <Link
                key={state.name}
                href={`/destinations?state=${state.short}`}
                className="state-card"
              >
                <span className="state-card-emoji">{state.icon}</span>
                <span className="state-card-name">{state.short}</span>
                <span className="state-card-desc">{state.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Destinations ── */}
      <section className="home-section home-section--alt">
        <div className="container">
          <div className="home-section-header">
            <p className="home-section-eyebrow">Featured</p>
            <h2 className="home-section-title">Must-Visit Destinations</h2>
            <p className="home-section-sub">Handpicked places that will take your breath away</p>
          </div>

          {featuredDestinations.length > 0 ? (
            <div className="dest-grid">
              {featuredDestinations.map((dest) => (
                <Link href={`/destinations/${dest.slug}`} key={dest.slug} className="dest-card">
                  <div className="dest-card-image">
                    <img src={dest.image || '/images/root-bridges.png'} alt={dest.title} className="dest-img" />
                    <div className="dest-card-overlay" />
                    <span className="dest-card-state">{dest.state}</span>
                    <div className="dest-card-details">
                      <h3 className="dest-card-title">{dest.title}</h3>
                      <span className="dest-card-explore">
                        <MapPin size={14} /> Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : !loading ? (
            <div className="home-placeholder">
              <p>Destinations will appear here once published by admins.</p>
              <Link href="/destinations" className="btn btn-outline">Browse All Destinations</Link>
            </div>
          ) : (
            <div className="dest-grid">
              {[1,2,3].map(i => <div key={i} className="t-skeleton" style={{ height: 400, borderRadius: 'var(--radius-2xl)' }} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/destinations" className="home-view-all">
              View all destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Upcoming Festivals ── */}
      {upcomingFestivals.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="home-section-header">
              <p className="home-section-eyebrow">Experiences</p>
              <h2 className="home-section-title">Upcoming Festivals</h2>
              <p className="home-section-sub">Witness the living traditions of the Northeast</p>
            </div>

            <div className="festival-grid-modern">
              {upcomingFestivals.map((f) => (
                <Link href="/festivals" key={f.slug} className="fest-card-elite">
                  <div className="fest-date-column">
                    <span className="fest-month-elite">{f.month || 'TBA'}</span>
                    <span className="fest-day-elite">{f.day || '—'}</span>
                  </div>
                  <div className="fest-content-column">
                    <div className="fest-header-elite">
                      <span className="badge badge-primary">{f.state}</span>
                    </div>
                    <h3 className="fest-name-elite">{f.name}</h3>
                    <p className="fest-desc-elite">{f.description}</p>
                    <div className="fest-learn-more">Learn more <ArrowRight size={14} /></div>
                  </div>
                  <div className="fest-image-column">
                    <div className="fest-image-overlay" />
                    <img src={f.image || '/images/root-bridges.png'} alt={f.name} className="fest-image-elite" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Packages ── */}
      {featuredPackages.length > 0 && (
        <section className="home-section home-section--alt">
          <div className="container">
            <div className="home-section-header">
              <p className="home-section-eyebrow">Curated</p>
              <h2 className="home-section-title">Popular Packages</h2>
              <p className="home-section-sub">Hand-crafted itineraries by local operators</p>
            </div>

            <div className="pkg-grid">
              {featuredPackages.map((pkg) => (
                <Link href={`/packages/${pkg.slug}`} key={pkg.slug} className="pkg-card-v2">
                  <div className="pkg-card-v2-img">
                    <img src={pkg.photos?.[0] || pkg.image || '/images/root-bridges.png'} alt={pkg.name} />
                    <div className="pkg-card-v2-overlay" />
                    <span className="pkg-card-v2-duration">
                      <Calendar size={13} /> {pkg.duration_days || pkg.duration} Days
                    </span>
                  </div>
                  <div className="pkg-card-v2-body">
                    <div className="pkg-card-v2-meta">
                      <span className="pkg-card-v2-operator">{pkg.operator || 'Local Operator'}</span>
                      <span className="pkg-card-v2-rating"><Star size={13} fill="currentColor" /> {pkg.rating || '4.8'}</span>
                    </div>
                    <h3 className="pkg-card-v2-name">{pkg.name}</h3>
                    <div className="pkg-card-v2-footer">
                      <div>
                        <span className="pkg-card-v2-price">₹{(pkg.total_price || pkg.price || 0).toLocaleString('en-IN')}</span>
                        <span className="pkg-card-v2-per"> / person</span>
                      </div>
                      <span className="pkg-card-v2-book">Book Now →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/packages" className="home-view-all">
                View all packages <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── AI Trip Planner ── */}
      <section className="home-section">
        <div className="container">
          <div className="ai-banner">
            <div className="ai-banner-content">
              <span className="ai-banner-badge"><Sparkles size={14} /> AI-Powered</span>
              <h2 className="ai-banner-title">Plan your perfect trip in seconds</h2>
              <p className="ai-banner-desc">
                Tell our AI about your budget, interests, and duration — get a personalized day-by-day itinerary instantly.
              </p>
              <Link href="/itinerary-builder" className="ai-banner-btn">
                <Sparkles size={18} /> Try AI Trip Planner
              </Link>
            </div>
            <div className="ai-banner-visual">
              <div className="ai-banner-visual-card">
                <div className="ai-banner-visual-dot" />
                <span>Day 1 — Shillong → Cherrapunji</span>
              </div>
              <div className="ai-banner-visual-card">
                <div className="ai-banner-visual-dot" style={{ background: 'var(--color-saffron-400)' }} />
                <span>Day 2 — Living Root Bridge Trek</span>
              </div>
              <div className="ai-banner-visual-card">
                <div className="ai-banner-visual-dot" style={{ background: 'var(--color-forest-400)' }} />
                <span>Day 3 — Dawki River & Mawlynnong</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Host CTA ── */}
      <section className="home-section home-section--alt" style={{ paddingBottom: '5rem' }}>
        <div className="container">
          <div className="host-banner">
            <div className="host-banner-content">
              <h2 className="host-banner-title">Own a Homestay or Run Tours?</h2>
              <p className="host-banner-desc">
                Join Northeast India's growing travel platform. List your property, create packages, and welcome travelers from around the world.
              </p>
              <div className="host-banner-actions">
                <Link href="/host/login" className="host-banner-btn-primary">
                  <Tent size={16} /> List Your Homestay
                </Link>
                <Link href="/host/login" className="host-banner-btn-secondary">
                  <Users size={16} /> Become an Operator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
