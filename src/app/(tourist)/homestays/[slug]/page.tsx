'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Users, ArrowLeft, Wifi, CheckCircle } from 'lucide-react'
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
        if (res.ok) {
          const data = await res.json()
          setListing(data)
        }
      } catch (e) {
        console.error('Failed to fetch listing:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [slug])

  if (loading) return <div className="container section center">Loading listing...</div>
  if (!listing) return <div className="container section center">Listing not found</div>

  return (
    <div className="container section">
      <Link href="/homestays" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Back to Homestays
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div>
          <div style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--color-earth-100), var(--color-earth-300))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-earth-500)' }}>
            {listing.photos?.[0] ? <img src={listing.photos[0]} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <MapPin size={48} />}
          </div>

          <span className="badge badge-primary">{listing.state}</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', margin: '0.5rem 0' }}>{listing.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-saffron-500)', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Star size={16} fill="currentColor" /> {listing.rating || '4.8'} · {listing.reviews || 'New'}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>About This Homestay</h2>
            <p style={{ lineHeight: 1.8 }}>
              {listing.description}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {(listing.amenities || []).map((a: string) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> {a}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>Languages Spoken</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(listing.languages || []).map((l: string) => <span key={l} className="badge badge-neutral">{l}</span>)}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>Reviews</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)' }}>
              No reviews yet for this listing.
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

          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-body" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>📍 Location</h4>
              <div style={{ background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                <MapPin size={24} /><br/>{listing.state}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
