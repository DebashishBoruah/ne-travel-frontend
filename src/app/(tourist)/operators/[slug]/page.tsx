import Link from 'next/link'
import { Star, MapPin, Clock, ArrowLeft, ArrowRight } from 'lucide-react'

export default async function OperatorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = slug
    .split('-')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="container section">
      <Link href="/packages" className="t-back-link">
        <ArrowLeft size={18} /> Back to Packages
      </Link>

      <div className="t-operator-header">
        <div className="t-operator-avatar">{name.charAt(0)}</div>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>{name}</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>
            Tour Operator · Northeast India
          </p>
          <div className="t-rating" style={{ marginTop: '0.25rem' }}>
            <Star size={14} fill="currentColor" /> 4.8 · 24 reviews
          </div>
        </div>
      </div>

      <div className="t-detail-section">
        <h2>About</h2>
        <p>
          Passionate about showcasing the hidden gems of Northeast India. With 5+ years of experience
          leading treks and cultural tours across Meghalaya, Nagaland, and Assam.
        </p>
      </div>

      <div className="t-detail-section">
        <h2>Active Packages</h2>
        <div className="listing-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[
            { name: '7 Days in Meghalaya', duration: 7, price: 25000, slug: 'meghalaya-adventure-7d' },
            { name: 'Nagaland Tribal Trail', duration: 5, price: 18000, slug: 'nagaland-tribal-5d' },
          ].map((pkg) => (
            <Link href={`/packages/${pkg.slug}`} key={pkg.slug} className="listing-card">
              <div className="listing-card-img">
                <div className="listing-card-img-fallback">
                  <MapPin size={28} strokeWidth={1.5} />
                </div>
                <div className="listing-card-img-overlay" />
              </div>
              <div className="listing-card-body">
                <h3 className="listing-card-title">{pkg.name}</h3>
                <div className="listing-card-footer">
                  <span className="listing-card-meta"><Clock size={13} /> {pkg.duration} days</span>
                  <span className="listing-card-price">
                    <span className="listing-card-price-amount">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
