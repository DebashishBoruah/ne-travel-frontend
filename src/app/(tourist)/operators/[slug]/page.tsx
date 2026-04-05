import Link from 'next/link'
import { Star, MapPin, Clock, Users, ArrowLeft } from 'lucide-react'

export default async function OperatorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = slug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="container section">
      <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Back to Packages
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-forest-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 700, flexShrink: 0 }}>
          {name.charAt(0)}
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>{name}</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>Tour Operator · Meghalaya</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-saffron-500)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            <Star size={14} fill="currentColor" /> 4.8 · 24 reviews
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '0.75rem' }}>About</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--color-text)' }}>
          Passionate about showcasing the hidden gems of Northeast India. With 5+ years of experience leading treks and cultural tours across Meghalaya, Nagaland, and Assam.
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem' }}>Active Packages</h2>
        <div className="grid-cards">
          {[
            { name: '7 Days in Meghalaya', duration: 7, price: 25000, slug: 'meghalaya-adventure-7d' },
            { name: 'Nagaland Tribal Trail', duration: 5, price: 18000, slug: 'nagaland-tribal-5d' },
          ].map(pkg => (
            <Link href={`/packages/${pkg.slug}`} key={pkg.slug} className="card" style={{ transition: 'transform 0.2s' }}>
              <div style={{ height: 150, background: 'linear-gradient(135deg, var(--color-forest-100), var(--color-forest-200))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest-400)' }}>
                <MapPin size={28} />
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>{pkg.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/> {pkg.duration} days</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{pkg.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
