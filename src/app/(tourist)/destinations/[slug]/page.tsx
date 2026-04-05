'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MapPin, Calendar, Shield, ArrowLeft, Cloud, Star } from 'lucide-react'
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
        if (res.ok) {
          const data = await res.json()
          setDestination(data)
        }
      } catch (e) {
        console.error('Failed to fetch destination:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchDestination()
  }, [slug])

  if (loading) return <div className="container section center">Loading destination...</div>
  if (!destination) return <div className="container section center">Destination not found</div>

  return (
    <div className="container section">
      <Link href="/destinations" className="back-link">
        <ArrowLeft size={18} /> Back to Destinations
      </Link>

      <div className="detail-hero">
        <div className="detail-hero-image">
          <div className="detail-hero-placeholder">
            <MapPin size={48} />
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <span className="badge badge-primary mb-4">{destination.state}</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-4)' }}>
            {destination.title}
          </h1>

          <div className="detail-meta">
            <div className="detail-meta-item">
              <Calendar size={16} />
              <span>Best Season: {destination.best_season}</span>
            </div>
            <div className="detail-meta-item">
              <Shield size={16} />
              <span>{destination.permit_required ? 'Permit Required' : 'No Permit Required'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>About</h2>
            <p>{destination.description}</p>
          </div>

          {destination.cultural_context && (
            <div className="detail-section">
              <h2>Cultural Context</h2>
              <p>{destination.cultural_context}</p>
            </div>
          )}

          {destination.tribal_history && (
            <div className="detail-section">
              <h2>Tribal History</h2>
              <p>{destination.tribal_history}</p>
            </div>
          )}

          <div className="detail-section">
            <h2>Available Packages</h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              Connect your Supabase database to see live packages for this destination.
            </p>
            <Link href="/packages" className="btn btn-primary mt-4">
              Browse All Packages
            </Link>
          </div>

          <div className="detail-section">
            <h2>Nearby Homestays</h2>
            <p style={{ color: 'var(--color-text-light)' }}>
              Connect your Supabase database to see homestays near this destination.
            </p>
            <Link href="/homestays" className="btn btn-outline mt-4">
              Browse Homestays
            </Link>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card p-4">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>📍 Location</h3>
            <div className="map-placeholder">
              <MapPin size={32} />
              <p>Map loads with OpenStreetMap</p>
              <p style={{ fontSize: 'var(--font-size-xs)' }}>
                {(destination.map_coordinates?.lat || destination.lat)}°N, {(destination.map_coordinates?.lng || destination.lng)}°E
              </p>
            </div>
          </div>

          <div className="card p-4 mt-4">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>🌤 Weather</h3>
            <WeatherWidget 
              lat={(destination.map_coordinates?.lat || destination.lat || '25.5').toString()} 
              lon={(destination.map_coordinates?.lng || destination.lng || '91.8').toString()} 
            />
          </div>

          {destination.permit_required && (
            <div className="card p-4 mt-4">
              <h3 style={{ marginBottom: 'var(--space-2)' }}>🛡️ Permit Required</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-3)' }}>
                You need a permit to visit {destination.state}.
              </p>
              <Link href="/permits" className="btn btn-accent btn-sm w-full">
                View Permit Guide
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-text-light);
          font-size: var(--font-size-sm);
          font-weight: 500;
          margin-bottom: var(--space-6);
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--color-primary);
        }

        .detail-hero-image {
          width: 100%;
          height: 400px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--space-8);
        }

        .detail-hero-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-forest-100), var(--color-forest-300));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-forest-500);
        }

        .detail-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-8);
        }

        @media (max-width: 1024px) {
          .detail-content {
            grid-template-columns: 1fr;
          }
        }

        .detail-meta {
          display: flex;
          gap: var(--space-6);
          flex-wrap: wrap;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }

        .detail-meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
          color: var(--color-text-light);
        }

        .detail-section {
          margin-bottom: var(--space-8);
        }

        .detail-section h2 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-3);
        }

        .detail-section p {
          color: var(--color-text);
          line-height: 1.8;
        }

        .map-placeholder, .weather-placeholder {
          background: var(--color-slate-50);
          border-radius: var(--radius-lg);
          padding: var(--space-8) var(--space-4);
          text-align: center;
          color: var(--color-text-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }
      `}</style>
    </div>
  )
}
