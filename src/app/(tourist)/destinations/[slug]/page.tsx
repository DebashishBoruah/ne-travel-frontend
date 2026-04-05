'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MapPin, Calendar, Shield, ArrowLeft } from 'lucide-react'
import { WeatherWidget } from '@/components/shared/WeatherWidget'
import { apiFetch } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function DestinationDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [destination, setDestination] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDestination() {
      try {
        const res = await apiFetch(`/api/content/destinations/${slug}`)
        if (res.ok) setDestination(await res.json())
      } catch (e) {
        console.error('Failed to fetch destination:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDestination()
  }, [slug])

  if (loading) {
    return (
      <div className="container section">
        <div className="t-skeleton" style={{ height: 20, width: 140, marginBottom: '1.5rem' }} />
        <div className="t-skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }} />
        <div className="t-skeleton t-skeleton-line medium" />
        <div className="t-skeleton t-skeleton-line" />
        <div className="t-skeleton t-skeleton-line short" />
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container section">
        <div className="t-empty">
          <div className="t-empty-icon"><MapPin size={40} /></div>
          <div className="t-empty-title">Destination not found</div>
          <div className="t-empty-desc">The destination you&apos;re looking for doesn&apos;t exist or has been removed.</div>
          <Link href="/destinations" className="btn btn-primary">Browse Destinations</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <Link href="/destinations" className="t-back-link">
        <ArrowLeft size={18} /> Back to Destinations
      </Link>

      <div className="t-detail-hero-img">
        {destination.image ? (
          <img src={destination.image} alt={destination.title} />
        ) : (
          <MapPin size={48} />
        )}
      </div>

      <div className="t-detail-layout">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {destination.state}
          </span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '1rem' }}>
            {destination.title}
          </h1>

          <div className="t-detail-meta">
            <div className="t-detail-meta-item">
              <Calendar size={16} />
              <span>Best Season: {destination.best_season || '—'}</span>
            </div>
            <div className="t-detail-meta-item">
              <Shield size={16} />
              <span>{destination.permit_required ? 'Permit Required' : 'No Permit Required'}</span>
            </div>
          </div>

          <div className="t-detail-section">
            <h2>About</h2>
            <p>{destination.description}</p>
          </div>

          {destination.cultural_context && (
            <div className="t-detail-section">
              <h2>Cultural Context</h2>
              <p>{destination.cultural_context}</p>
            </div>
          )}

          {destination.tribal_history && (
            <div className="t-detail-section">
              <h2>Tribal History</h2>
              <p>{destination.tribal_history}</p>
            </div>
          )}

          <div className="t-detail-section">
            <h2>Available Packages</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
              Browse curated tour packages that visit this destination.
            </p>
            <Link href="/packages" className="btn btn-primary">Browse All Packages</Link>
          </div>

          <div className="t-detail-section">
            <h2>Nearby Homestays</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
              Find authentic local homestays near this destination.
            </p>
            <Link href="/homestays" className="btn btn-outline">Browse Homestays</Link>
          </div>
        </div>

        <div>
          <div className="t-info-card">
            <div className="t-info-card-title">
              <MapPin size={16} /> Location
            </div>
            <div className="t-map-placeholder">
              <MapPin size={32} />
              <p>Map loads with OpenStreetMap</p>
              <p style={{ fontSize: 'var(--font-size-xs)' }}>
                {destination.map_coordinates?.lat || destination.lat || '—'}°N,{' '}
                {destination.map_coordinates?.lng || destination.lng || '—'}°E
              </p>
            </div>
          </div>

          <div className="t-info-card">
            <div className="t-info-card-title">
              ☁️ Weather
            </div>
            <WeatherWidget
              lat={(destination.map_coordinates?.lat || destination.lat || '25.5').toString()}
              lon={(destination.map_coordinates?.lng || destination.lng || '91.8').toString()}
            />
          </div>

          {destination.permit_required && (
            <div className="t-info-card">
              <div className="t-info-card-title">
                <Shield size={16} /> Permit Required
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
                You need a permit to visit {destination.state}.
              </p>
              <Link href="/permits" className="btn btn-accent btn-sm" style={{ width: '100%' }}>
                View Permit Guide
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
