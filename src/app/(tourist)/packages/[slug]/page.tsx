'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Clock, Users, MapPin, Shield, Truck, ArrowLeft } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { BookingWidget } from '@/components/shared/BookingWidget'

export default function PackageDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [pkg, setPkg] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await apiFetch(`/api/packages/${slug}`)
        if (res.ok) setPkg(await res.json())
      } catch (e) {
        console.error('Failed to fetch package:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPackage()
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

  if (!pkg) {
    return (
      <div className="container section">
        <div className="t-empty">
          <div className="t-empty-icon"><MapPin size={40} /></div>
          <div className="t-empty-title">Package not found</div>
          <div className="t-empty-desc">This package may have been removed or is no longer available.</div>
          <Link href="/packages" className="btn btn-primary">Browse Packages</Link>
        </div>
      </div>
    )
  }

  const itineraryDays = pkg.itinerary
    ? pkg.itinerary.split('\n').filter((d: string) => d.trim())
    : []

  return (
    <div className="container section">
      <Link href="/packages" className="t-back-link">
        <ArrowLeft size={18} /> Back to Packages
      </Link>

      <div className="t-detail-layout">
        <div>
          <div className="t-detail-hero-img">
            {pkg.photos?.[0] ? (
              <img src={pkg.photos[0]} alt={pkg.name} />
            ) : (
              <MapPin size={48} />
            )}
          </div>

          <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            {pkg.homestay?.state || 'Northeast India'}
          </span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', margin: '0.5rem 0 1rem' }}>{pkg.name}</h1>

          <div className="t-detail-meta">
            <div className="t-detail-meta-item">
              <Clock size={16} /> {pkg.duration_days} days
            </div>
            <div className="t-detail-meta-item">
              <Users size={16} /> Max {pkg.max_group_size} people
            </div>
            <div className="t-rating">
              <Star size={16} fill="currentColor" /> {pkg.rating || '4.8'} ({pkg.reviews_count || '—'} reviews)
            </div>
          </div>

          <div className="t-detail-section">
            <h2>About This Package</h2>
            <p>{pkg.description}</p>
          </div>

          {itineraryDays.length > 0 && (
            <div className="t-detail-section">
              <h2>Day-by-Day Itinerary</h2>
              {itineraryDays.map((day: string, i: number) => (
                <div key={i} className="t-itin-day">
                  <div className="t-itin-day-num">{i + 1}</div>
                  <div className="t-itin-day-content">
                    <div className="t-itin-day-desc">{day}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="t-detail-section">
            <h2>What&apos;s Included</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {pkg.includes_permits && (
                <div className="t-inclusion-pill"><Shield size={18} /> Permits Included</div>
              )}
              {pkg.includes_transport && (
                <div className="t-inclusion-pill"><Truck size={18} /> Transport Included</div>
              )}
              {pkg.includes_guide && (
                <div className="t-inclusion-pill"><Users size={18} /> Local Guide</div>
              )}
            </div>
          </div>

          <div className="t-detail-section">
            <h2>Reviews</h2>
            <div className="t-empty" style={{ padding: '2rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)' }}>
              <div className="t-empty-desc" style={{ marginBottom: 0 }}>No reviews yet for this package.</div>
            </div>
          </div>
        </div>

        <div>
          <BookingWidget
            packageId={pkg.id}
            operatorId={pkg.operator_id}
            operatorName={pkg.operator?.name || 'NE Adventures'}
            operatorPhone={pkg.operator?.phone}
            price={pkg.total_price}
            itemName={pkg.name}
          />

          <div className="t-info-card">
            <div className="t-info-card-title">Operator</div>
            <p style={{ fontWeight: 600 }}>{pkg.operator?.name || 'NE Adventures'}</p>
            <div className="t-rating" style={{ margin: '0.25rem 0 0.75rem' }}>
              <Star size={14} fill="currentColor" /> 4.8 · 24 reviews
            </div>
            <Link
              href={`/operators/${pkg.operator_id}`}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%' }}
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
