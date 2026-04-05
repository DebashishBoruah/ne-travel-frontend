'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Sparkles,
  FileText,
  ScrollText,
  Users,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Plus,
} from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface PlatformStats {
  destinations: number
  festivals: number
  articles: number
  permits: number
  users: number
  bookings: number
}

const STAT_CARDS: {
  key: keyof PlatformStats
  label: string
  icon: React.ReactNode
  href: string
  color: string
  bg: string
}[] = [
  { key: 'destinations', label: 'Destinations',  icon: <MapPin size={20} />,     href: '/admin/content/destinations', color: '#3ecf8e', bg: '#ecfdf5' },
  { key: 'festivals',    label: 'Festivals',     icon: <Sparkles size={20} />,   href: '/admin/content/festivals',    color: '#f59e0b', bg: '#fffbeb' },
  { key: 'articles',     label: 'Articles',      icon: <FileText size={20} />,   href: '/admin/content/articles',     color: '#6366f1', bg: '#eef2ff' },
  { key: 'permits',      label: 'Permit Guides', icon: <ScrollText size={20} />, href: '/admin/content/permits',      color: '#ec4899', bg: '#fdf2f8' },
  { key: 'users',        label: 'Users',         icon: <Users size={20} />,      href: '/admin/users',                color: '#0ea5e9', bg: '#f0f9ff' },
  { key: 'bookings',     label: 'Bookings',      icon: <Calendar size={20} />,   href: '/admin/bookings',             color: '#8b5cf6', bg: '#f5f3ff' },
]

const QUICK_ACTIONS = [
  { label: 'Add Destination', href: '/admin/content/destinations',     icon: <MapPin size={14} /> },
  { label: 'Add Festival',    href: '/admin/content/festivals',        icon: <Sparkles size={14} /> },
  { label: 'Add Article',     href: '/admin/content/articles/new',     icon: <FileText size={14} /> },
  { label: 'Add Permit Guide',href: '/admin/content/permits/new',      icon: <ScrollText size={14} /> },
]

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats>({
    destinations: 0, festivals: 0, articles: 0, permits: 0, users: 0, bookings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [dest, fest, art, perm, usr, book] = await Promise.allSettled([
          apiFetch('/api/destinations?limit=0'),
          apiFetch('/api/festivals?limit=0'),
          apiFetch('/api/articles?limit=0'),
          apiFetch('/api/permits?limit=0'),
          apiFetch('/api/users?limit=0'),
          apiFetch('/api/bookings?limit=0'),
        ])
        const count = (r: PromiseSettledResult<Response>) => {
          if (r.status === 'fulfilled') {
            return r.value.headers.get('x-total-count')
              ? Number(r.value.headers.get('x-total-count'))
              : 0
          }
          return 0
        }
        setStats({
          destinations: count(dest),
          festivals: count(fest),
          articles: count(art),
          permits: count(perm),
          users: count(usr),
          bookings: count(book),
        })
      } catch {
        // stats stay at 0
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
          Project Overview
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-subtle)' }}>
          Your NorthEast Travel platform at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.875rem',
        marginBottom: '2.5rem',
      }}>
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '1rem 1.125rem',
              background: '#fff',
              border: '1px solid var(--admin-border-standard)',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.color
              e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}22`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-border-standard)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: 40, height: 40,
              borderRadius: '0.5rem',
              background: card.bg,
              color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--admin-text-main)',
                lineHeight: 1.2,
              }}>
                {loading ? '–' : stats[card.key]}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--admin-text-subtle)',
                marginTop: 2,
              }}>
                {card.label}
              </div>
            </div>
          </Link>
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
          {QUICK_ACTIONS.map((action) => (
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
          <TrendingUp size={16} style={{ color: '#3ecf8e' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
            Getting Started
          </span>
        </div>
        <div style={{ padding: '0.25rem 0' }}>
          <GettingStartedRow
            step={1}
            title="Add your first destination"
            description="Create a travel destination with images, location, and details."
            href="/admin/content/destinations"
          />
          <GettingStartedRow
            step={2}
            title="Add a festival"
            description="Document the cultural festivals of Northeast India."
            href="/admin/content/festivals"
          />
          <GettingStartedRow
            step={3}
            title="Write an article"
            description="Share travel tips, guides, and stories."
            href="/admin/content/articles/new"
          />
          <GettingStartedRow
            step={4}
            title="Create a permit guide"
            description="Help travellers navigate inner-line and restricted-area permits."
            href="/admin/content/permits/new"
          />
        </div>
      </div>
    </div>
  )
}

function GettingStartedRow({
  step, title, description, href,
}: {
  step: number; title: string; description: string; href: string
}) {
  return (
    <Link
      href={href}
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
        {step}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)', marginTop: 1 }}>
          {description}
        </div>
      </div>
      <ArrowUpRight size={14} style={{ color: '#d1d5db', flexShrink: 0 }} />
    </Link>
  )
}
