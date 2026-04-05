'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Users, ArrowLeft, CheckCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { BookingWidget } from '@/components/shared/BookingWidget'

export default function HomestayDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await apiFetch(`/api/listings/${slug}`)
        if (res.ok) setListing(await res.json())
      } catch (e) {
        console.error('Failed to fetch listing:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [slug])

  if (loading) {
    return (
      <div className="container section">
        <div className="t-skeleton" style={{ height: 20, width: 140, marginBottom: '1.5rem' }} />
        <div className="t-skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }} />
        <div className="t-skeleton t-skeleton-line medium" />
        <div className="t-skeleton t-skeleton-line" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container section">
        <div className="t-empty">
          <div className="t-empty-icon"><MapPin size={40} /></div>
          <div className="t-empty-title">Homestay not found</div>
          <div className="t-empty-desc">This listing may have been removed or is no longer available.</div>
          <Link href="/homestays" className="btn btn-primary">Browse Homestays</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <Link href="/homestays" className="t-back-link">
        <ArrowLeft size={18} /> Back to Homestays
      </Link>

      <div className="t-detail-layout">
        <div>
          <div className="t-detail-hero-img" style={{ background: 'linear-gradient(135deg, var(--color-earth-100), var(--color-earth-300))', color: 'var(--color-earth-500)' }}>
            {listing.photos?.[0] || listing.hero_image ? (
              <img src={listing.photos?.[0] || listing.hero_image} alt={listing.name} />
            ) : (
              <MapPin size={48} />
            )}
          </div>

          <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            {listing.state}
          </span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', margin: '0.5rem 0' }}>{listing.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-saffron-500)', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Star size={16} fill="currentColor" /> {listing.rating || '4.8'} · {listing.reviews || 'New'}
          </p>

          <div className="t-detail-section">
            <h2>About This Homestay</h2>
            <p>{listing.description}</p>
          </div>

          <div className="t-detail-section">
            <h2>Amenities</h2>
            <div className="t-amenity-grid">
              {(listing.amenities || []).map((a: string) => (
                <div key={a} className="t-amenity-item">
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> {a}
                </div>
              ))}
            </div>
          </div>

          {(listing.languages || []).length > 0 && (
            <div className="t-detail-section">
              <h2>Languages Spoken</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {listing.languages.map((l: string) => (
                  <span key={l} className="badge badge-neutral">{l}</span>
                ))}
              </div>
            </div>
          )}

          <div className="t-detail-section">
            <h2>Reviews</h2>
            <div className="t-empty" style={{ padding: '2rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)' }}>
              <div className="t-empty-desc" style={{ marginBottom: 0 }}>No reviews yet for this listing.</div>
            </div>
          </div>
        </div>

        <div>
          <BookingWidget
            homestayId={listing.id}
            operatorId={listing.owner_id}
            operatorName={listing.owner?.name || 'Local Host'}
            price={listing.price_per_night}
            itemName={listing.name}
          />

          <div className="t-info-card">
            <div className="t-info-card-title">
              <MapPin size={16} /> Location
            </div>
            <div className="t-map-placeholder">
              <MapPin size={24} />
              <span>{listing.state}</span>
            </div>
          </div>

          <div className="t-info-card">
            <div className="t-info-card-title">
              <Users size={16} /> Capacity
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
              Up to {listing.max_guests || listing.maxGuests || '—'} guests
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
