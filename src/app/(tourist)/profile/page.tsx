import Link from 'next/link'
import { User, Calendar, Star, Heart, ArrowRight } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '2rem' }}>My Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        <div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-forest-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--color-primary)' }}>
              <User size={32} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Traveler</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>Member since 2024</p>
            <button className="btn btn-outline btn-sm w-full mt-4">Edit Profile</button>
          </div>

          <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { icon: <Calendar size={18} />, label: 'My Bookings', active: true },
                { icon: <Star size={18} />, label: 'My Reviews', active: false },
                { icon: <Heart size={18} />, label: 'Wishlist', active: false },
              ].map((item, i) => (
                <button key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', fontWeight: item.active ? 600 : 400, background: item.active ? 'var(--color-forest-50)' : 'transparent', color: item.active ? 'var(--color-primary)' : 'var(--color-text)', textAlign: 'left' }}>
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem' }}>My Bookings</h2>
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-xl)' }}>
            <Calendar size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No bookings yet</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>Start exploring Northeast India and book your first trip!</p>
            <Link href="/packages" className="btn btn-primary">Browse Packages <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
