'use client'

import Link from 'next/link'
import { User, Calendar, Star, Heart, ArrowRight } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '2rem' }}>My Profile</h1>

      <div className="t-profile-layout">
        <div>
          <div className="t-info-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div className="t-profile-avatar">
              <User size={32} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Traveler</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
              Member since 2024
            </p>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
              Edit Profile
            </button>
          </div>

          <div className="t-info-card" style={{ padding: '0.5rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { icon: <Calendar size={18} />, label: 'My Bookings', active: true },
                { icon: <Star size={18} />, label: 'My Reviews', active: false },
                { icon: <Heart size={18} />, label: 'Wishlist', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`t-profile-nav-item${item.active ? ' active' : ''}`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '1rem' }}>My Bookings</h2>
          <div className="t-empty" style={{ background: 'var(--color-slate-50)', borderRadius: 'var(--radius-xl)' }}>
            <div className="t-empty-icon"><Calendar size={40} /></div>
            <div className="t-empty-title">No bookings yet</div>
            <div className="t-empty-desc">
              Start exploring Northeast India and book your first trip!
            </div>
            <Link href="/packages" className="btn btn-primary">
              Browse Packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
