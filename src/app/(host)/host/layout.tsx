'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  Calendar,
  Inbox,
  DollarSign,
  Star,
  Menu,
  X,
  Settings,
  LogOut,
  Search,
  HelpCircle,
  Bell,
  Command,
  Package,
  Map,
} from 'lucide-react'
import { signOut } from '@/features/auth/actions'
import { useAuth } from '@/hooks/useAuth'
import { HostBreadcrumbs } from '@/components/host/HostBreadcrumbs'

type NavItem = { href: string; icon: React.ReactNode; label: string }
type NavSection = { title: string; items: NavItem[] }

const SHARED_TOP: NavSection = {
  title: 'Overview',
  items: [
    { href: '/host/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  ],
}

const HOMESTAY_SECTIONS: NavSection[] = [
  SHARED_TOP,
  {
    title: 'Manage',
    items: [
      { href: '/host/listings', icon: <Home size={16} />, label: 'My Homestays' },
      { href: '/host/bookings', icon: <Inbox size={16} />, label: 'Bookings' },
      { href: '/host/calendar', icon: <Calendar size={16} />, label: 'Calendar' },
    ],
  },
  {
    title: 'Finance & Reviews',
    items: [
      { href: '/host/earnings', icon: <DollarSign size={16} />, label: 'Earnings' },
      { href: '/host/reviews', icon: <Star size={16} />, label: 'Reviews' },
    ],
  },
]

const OPERATOR_SECTIONS: NavSection[] = [
  SHARED_TOP,
  {
    title: 'Manage',
    items: [
      { href: '/host/packages', icon: <Package size={16} />, label: 'My Packages' },
      { href: '/host/bookings', icon: <Inbox size={16} />, label: 'Bookings' },
    ],
  },
  {
    title: 'Finance & Reviews',
    items: [
      { href: '/host/earnings', icon: <DollarSign size={16} />, label: 'Earnings' },
      { href: '/host/reviews', icon: <Star size={16} />, label: 'Reviews' },
    ],
  },
]

/** While `/api/auth/me` loads, avoid showing the wrong role's nav (defaults to homestay). */
const AUTH_LOADING_SECTIONS: NavSection[] = [SHARED_TOP]

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const isOperator = user?.role === 'operator'
  const sections = authLoading
    ? AUTH_LOADING_SECTIONS
    : isOperator
      ? OPERATOR_SECTIONS
      : HOMESTAY_SECTIONS

  const portalLabel = authLoading ? 'Host Portal' : isOperator ? 'Operator Portal' : 'Host Portal'
  const portalColor = authLoading ? '#64748b' : isOperator ? '#059669' : '#6366f1'
  const portalIcon = authLoading ? <LayoutDashboard size={14} strokeWidth={2.5} /> : isOperator ? <Map size={14} strokeWidth={2.5} /> : <Home size={14} strokeWidth={2.5} />

  const handleLogout = async () => {
    document.cookie = 'ne_auth_token=; path=/; max-age=0'
    document.cookie = 'mock-auth=; path=/; max-age=0'
    try { await signOut() } catch { /* cleared client-side */ }
    window.location.href = '/host/login'
  }

  return (
    <div className="host-layout-wrapper" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? '' : ' admin-sidebar--closed'}`}>
        <div className="admin-sidebar-logo">
          <div style={{
            width: 24, height: 24, padding: 2,
            background: portalColor, borderRadius: 4,
            color: 'white', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {portalIcon}
          </div>
          <span style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.875rem' }}>
            {portalLabel}
          </span>
        </div>

        {/* Role indicator */}
        {authLoading ? (
          <div style={{
            margin: '0 0.75rem 0.5rem',
            padding: '0.375rem 0.625rem',
            background: '#f1f5f9',
            borderRadius: '0.375rem',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#94a3b8',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}>
            Loading profile…
          </div>
        ) : user ? (
          <div style={{
            margin: '0 0.75rem 0.5rem',
            padding: '0.375rem 0.625rem',
            background: isOperator ? '#ecfdf5' : '#eef2ff',
            borderRadius: '0.375rem',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: isOperator ? '#059669' : '#6366f1',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}>
            {isOperator ? 'Tour Operator' : 'Homestay Owner'}
          </div>
        ) : null}

        <nav className="admin-sidebar-nav">
          {sections.map((section, sIndex) => (
            <div key={sIndex}>
              {section.title && <div className="admin-nav-section-title">{section.title}</div>}
              {section.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`admin-nav-item${isActive ? ' active' : ''}`}
                  >
                    <span className="admin-nav-item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/host/settings" className="admin-nav-item" style={{ margin: 0 }}>
            <span className="admin-nav-item-icon"><Settings size={16} /></span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="admin-content-wrapper">
        <header className="admin-top-nav">
          <div className="admin-top-nav-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <HostBreadcrumbs />
          </div>

          <div className="admin-top-nav-right">
            <div className="admin-topnav-search">
              <Search size={14} />
              <span>Search...</span>
              <span className="admin-topnav-search-shortcut">
                <Command size={10} />K
              </span>
            </div>

            <div className="admin-topnav-divider" />

            <button className="admin-topnav-icon-btn" aria-label="Help">
              <HelpCircle size={17} />
            </button>
            <button className="admin-topnav-icon-btn" aria-label="Notifications">
              <Bell size={17} />
            </button>

            <div className="admin-topnav-divider" />

            <div style={{ position: 'relative' }}>
              <button
                className="admin-topnav-avatar"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Host')}&background=${isOperator ? 'ecfdf5' : 'eef2ff'}&color=${isOperator ? '059669' : '6366f1'}&size=32`}
                  alt="Profile"
                />
              </button>

              {profileOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                  <div className="admin-profile-dropdown">
                    <div className="admin-profile-dropdown-header">
                      <div className="admin-profile-dropdown-label">Signed in as</div>
                      <div className="admin-profile-dropdown-email">{user?.email ?? 'Host'}</div>
                      <div style={{ fontSize: '0.6875rem', color: isOperator ? '#059669' : '#6366f1', fontWeight: 600, marginTop: 2 }}>
                        {isOperator ? 'Tour Operator' : 'Homestay Owner'}
                      </div>
                    </div>
                    <Link href="/host/settings" className="admin-profile-dropdown-item">
                      <Settings size={14} /> Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="admin-profile-dropdown-item admin-profile-dropdown-item--danger"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="admin-main-content">
          {children}
        </main>
      </div>

      <div
        className={`admin-sidebar-overlay${sidebarOpen ? ' admin-sidebar-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  )
}
