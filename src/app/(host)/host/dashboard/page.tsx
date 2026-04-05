'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Package,
  Inbox,
  Calendar,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Plus,
  Map,
  Users,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Booking {
  id: string
  tourist: string
  dates: string
  guests: number
  amount: string
  status: 'pending' | 'confirmed' | 'completed'
}

const DEMO_BOOKINGS: Booking[] = [
  { id: '1', tourist: 'Rahul Sharma',  dates: '15–21 Dec 2024', guests: 2, amount: '₹50,000',  status: 'pending' },
  { id: '2', tourist: 'Priya Patel',   dates: '20–23 Dec 2024', guests: 4, amount: '₹18,000',  status: 'confirmed' },
  { id: '3', tourist: 'John Smith',    dates: '25–30 Dec 2024', guests: 3, amount: '₹75,000',  status: 'pending' },
]

const OWNER_STATS = [
  { label: 'Active Listings',  value: '–', icon: <Home size={20} />,        color: '#6366f1', bg: '#eef2ff' },
  { label: 'Pending Bookings', value: '–', icon: <Clock size={20} />,       color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Confirmed',        value: '–', icon: <CheckCircle size={20} />, color: '#10b981', bg: '#ecfdf5' },
  { label: 'Total Earnings',   value: '–', icon: <DollarSign size={20} />,  color: '#8b5cf6', bg: '#f5f3ff' },
]

const OPERATOR_STATS = [
  { label: 'Active Packages',  value: '–', icon: <Package size={20} />,     color: '#059669', bg: '#ecfdf5' },
  { label: 'Pending Bookings', value: '–', icon: <Clock size={20} />,       color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Total Travellers', value: '–', icon: <Users size={20} />,       color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Total Earnings',   value: '–', icon: <TrendingUp size={20} />,  color: '#8b5cf6', bg: '#f5f3ff' },
]

const OWNER_ACTIONS = [
  { label: 'New Listing',   href: '/host/listings/new', icon: <Home size={14} />,    desc: 'Register a homestay' },
  { label: 'View Bookings', href: '/host/bookings',     icon: <Inbox size={14} />,   desc: 'Manage reservations' },
  { label: 'Calendar',      href: '/host/calendar',     icon: <Calendar size={14} />,desc: 'Check availability' },
  { label: 'Earnings',      href: '/host/earnings',     icon: <DollarSign size={14} />, desc: 'Track income' },
]

const OPERATOR_ACTIONS = [
  { label: 'New Package',   href: '/host/packages/new', icon: <Package size={14} />, desc: 'Create a tour' },
  { label: 'My Packages',   href: '/host/packages',     icon: <Map size={14} />,     desc: 'Manage tours' },
  { label: 'View Bookings', href: '/host/bookings',     icon: <Inbox size={14} />,   desc: 'Manage reservations' },
  { label: 'Earnings',      href: '/host/earnings',     icon: <DollarSign size={14} />, desc: 'Track income' },
]

const OWNER_GETTING_STARTED = [
  { step: 1, title: 'Create your first listing', description: 'Add your homestay with photos and pricing.', href: '/host/listings/new' },
  { step: 2, title: 'Set up availability', description: 'Block dates and manage your calendar.', href: '/host/calendar' },
  { step: 3, title: 'Get your first booking', description: 'Share your listing and wait for travellers.', href: '/host/bookings' },
]

const OPERATOR_GETTING_STARTED = [
  { step: 1, title: 'Create your first package', description: 'Design a multi-day tour with itinerary and pricing.', href: '/host/packages/new' },
  { step: 2, title: 'Link a homestay', description: 'Partner with homestay owners for accommodation.', href: '/host/packages/new' },
  { step: 3, title: 'Get your first booking', description: 'Share your package and attract travellers.', href: '/host/bookings' },
]

export default function HostDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [bookings] = useState<Booking[]>(DEMO_BOOKINGS)

  const isOperator = user?.role === 'operator'
  const stats = isOperator ? OPERATOR_STATS : OWNER_STATS
  const actions = isOperator ? OPERATOR_ACTIONS : OWNER_ACTIONS
  const gettingStarted = isOperator ? OPERATOR_GETTING_STARTED : OWNER_GETTING_STARTED
  const accent = isOperator ? '#059669' : '#6366f1'

  if (authLoading) {
    return (
      <div style={{ maxWidth: 1000 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="t-skeleton" style={{ height: 28, width: 220, marginBottom: 8, borderRadius: 6 }} />
          <div className="t-skeleton" style={{ height: 16, width: 320, borderRadius: 6 }} />
        </div>
        <div className="host-stat-grid" style={{ marginBottom: '2.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="host-stat-card" style={{ opacity: 0.6 }}>
              <div className="t-skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div className="t-skeleton" style={{ height: 22, width: 48, marginBottom: 6, borderRadius: 4 }} />
                <div className="t-skeleton" style={{ height: 12, width: 100, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--admin-text-main)',
          letterSpacing: '-0.02em',
          marginBottom: '0.25rem',
        }}>
          {authLoading ? 'Dashboard' : `Welcome back, ${user?.name?.split(' ')[0] || 'there'}`}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-subtle)' }}>
          {isOperator
            ? 'Monitor your tour packages, bookings, and earnings.'
            : 'Monitor your properties, bookings, and earnings.'}
        </p>
      </div>

      {/* Stats */}
      <div className="host-stat-grid" style={{ marginBottom: '2.5rem' }}>
        {stats.map((card) => (
          <div key={card.label} className="host-stat-card">
            <div className="host-stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="host-stat-value">{card.value}</div>
              <div className="host-stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--admin-text-main)',
          marginBottom: '0.75rem',
        }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <Plus size={12} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}>
          <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
            Recent Bookings
          </h2>
          <Link
            href="/host/bookings"
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: accent,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            View all <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="host-table-wrap">
          <table className="host-table">
            <thead>
              <tr>
                <th>Traveller</th>
                <th>Dates</th>
                <th>Guests</th>
                <th>Revenue</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span className="host-table-avatar">{b.tourist.charAt(0)}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{b.tourist}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-subtle)' }}>
                          #BK-{b.id}829
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{b.dates}</td>
                  <td>{b.guests}</td>
                  <td style={{ fontWeight: 600 }}>{b.amount}</td>
                  <td>
                    <span className={`host-status-badge host-status-badge--${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="host-table-actions">
                      {b.status === 'pending' ? (
                        <>
                          <button className="admin-btn admin-btn-sm" style={{ background: accent, color: '#fff', border: 'none' }}>
                            Confirm
                          </button>
                          <button className="admin-btn admin-btn-sm admin-btn-danger">
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="admin-btn admin-btn-sm admin-btn-secondary">
                          Manage
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Getting Started */}
      <div style={{
        border: '1px solid var(--admin-border-standard)',
        borderRadius: '0.5rem',
        background: '#fff',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--admin-border-standard)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <Star size={16} style={{ color: accent }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
            Getting Started
          </span>
        </div>
        <div style={{ padding: '0.25rem 0' }}>
          {gettingStarted.map((item) => (
            <Link
              key={item.step}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1.25rem',
                textDecoration: 'none',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                border: '1.5px solid var(--admin-border-standard)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--admin-text-subtle)',
                flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)', marginTop: 1 }}>
                  {item.description}
                </div>
              </div>
              <ArrowUpRight size={14} style={{ color: '#d1d5db', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
