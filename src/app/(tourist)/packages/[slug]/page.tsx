'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Clock, Users, MapPin, Shield, Truck, ArrowLeft, Calendar as CalIcon, CheckCircle } from 'lucide-react'
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
        if (res.ok) {
          const data = await res.json()
          setPkg(data)
        }
      } catch (e) {
        console.error('Failed to fetch package:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPackage()
  }, [slug])

  if (loading) return <div className="container section center">Loading package...</div>
  if (!pkg) return <div className="container section center">Package not found</div>

  const itineraryDays = pkg.itinerary ? pkg.itinerary.split('\n').filter((d: string) => d.trim()) : []

  return (
    <div className="container section">
      <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Back to Packages
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div>
          {/* Hero Image */}
          <div style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--color-forest-100), var(--color-forest-300))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-500)' }}>
            {pkg.photos?.[0] ? <img src={pkg.photos[0]} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <MapPin size={48} />}
          </div>

          <span className="badge badge-primary">{pkg.homestay?.state || 'Meghalaya'}</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', margin: '0.5rem 0 1rem' }}>{pkg.name}</h1>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}><Clock size={16}/> {pkg.duration_days} days</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}><Users size={16}/> Max {pkg.max_group_size} people</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-saffron-500)' }}><Star size={16} fill="currentColor"/> {pkg.rating || '4.8'} ({pkg.reviews_count || '24'} reviews)</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>About This Package</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
              {pkg.description}
            </p>
          </div>

          {itineraryDays.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>Day-by-Day Itinerary</h2>
              {itineraryDays.map((day: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-forest-100)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--font-size-sm)', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', paddingTop: '0.25rem' }}>{day}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>What&apos;s Included</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {pkg.includes_permits && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-forest-50)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 500 }}><Shield size={18} /> Permits Included</div>}
              {pkg.includes_transport && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-forest-50)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 500 }}><Truck size={18} /> Transport Included</div>}
              {pkg.includes_guide && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-forest-50)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 500 }}><Users size={18} /> Local Guide</div>}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>Reviews</h2>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)' }}>
              Reviews will appear here when connected to Supabase
            </div>
          </div>
        </div>

        {/* Sidebar - Booking */}
        <div>
          <BookingWidget
            packageId={pkg.id}
            operatorId={pkg.operator_id}
            operatorName={pkg.operator?.name || 'NE Adventures'}
            operatorPhone={pkg.operator?.phone}
            price={pkg.total_price}
            itemName={pkg.name}
          />

          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-body" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>Operator</h4>
              <p style={{ fontWeight: 600 }}>{pkg.operator?.name || 'NE Adventures'}</p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>⭐ 4.8 · 24 reviews</p>
              <Link href={`/operators/${pkg.operator_id}`} className="btn btn-ghost btn-sm mt-2" style={{ width: '100%' }}>View Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
