'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  CheckSquare,
  Calendar,
  Users,
  DollarSign,
  FileText,
  Shield,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Search,
  HelpCircle,
  Bell,
  Command,
} from 'lucide-react'
import { signOut } from '@/features/auth/actions'
import { useAuth } from '@/hooks/useAuth'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'

const sidebarSections = [
  {
    title: 'Project',
    items: [
      { href: '/admin', icon: <LayoutDashboard size={16} />, label: 'Project Overview' },
    ]
  },
  {
    title: 'Content Management',
    items: [
      { 
        href: '/admin/content', 
        icon: <FileText size={16} />, 
        label: 'Content',
        subItems: [
          { href: '/admin/content/destinations', label: 'Destinations' },
          { href: '/admin/content/festivals', label: 'Festivals' },
          { href: '/admin/content/articles', label: 'Articles' },
          { href: '/admin/content/permits', label: 'Permit Guides' },
        ]
      },
      { href: '/admin/approvals', icon: <CheckSquare size={16} />, label: 'Approvals' },
      { href: '/admin/bookings', icon: <Calendar size={16} />, label: 'All Bookings' },
    ]
  },
  {
    title: 'Infrastructure',
    items: [
      { href: '/admin/users', icon: <Users size={16} />, label: 'Users' },
      { href: '/admin/payouts', icon: <DollarSign size={16} />, label: 'Payouts' },
    ]
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['/admin/content'])
  const [profileOpen, setProfileOpen] = useState(false)

  const toggleExpand = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    setExpandedItems(prev => 
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    )
  }

  const handleLogout = async () => {
    document.cookie = 'ne_auth_token=; path=/; max-age=0'
    document.cookie = 'mock-auth=; path=/; max-age=0'
    try { await signOut() } catch { /* cookie already cleared client-side */ }
    window.location.href = '/admin/login'
  }

  return (
    <div className="admin-layout-wrapper" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? '' : ' admin-sidebar--closed'}`}>
        <div className="admin-sidebar-logo">
          <div style={{
            width: 24, height: 24, padding: 2,
            background: '#3ecf8e', borderRadius: 4,
            color: 'white', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Shield size={14} strokeWidth={3} />
          </div>
          <span style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.875rem' }}>NorthEastTravel</span>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarSections.map((section, sIndex) => (
            <div key={sIndex}>
              {section.title && <div className="admin-nav-section-title">{section.title}</div>}
              {section.items.map(item => {
                const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href))
                const isExpanded = expandedItems.includes(item.href)

                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.subItems) {
                          toggleExpand(item.href, e)
                        } else {
                          setSidebarOpen(false)
                        }
                      }}
                      className={`admin-nav-item${isActive ? ' active' : ''}`}
                    >
                      <span className="admin-nav-item-icon">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.subItems && (
                        <span className="admin-nav-item-chevron">
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                      )}
                    </Link>

                    {item.subItems && isExpanded && (
                      <div className="admin-nav-sub-list">
                        {item.subItems.map(subItem => {
                          const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`admin-nav-sub-item${isSubActive ? ' active' : ''}`}
                            >
                              {subItem.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/admin/settings" className="admin-nav-item" style={{ margin: 0 }}>
            <span className="admin-nav-item-icon"><Settings size={16} /></span>
            <span>Project Settings</span>
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
            <Breadcrumbs />
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
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=f3f4f6&color=6b7280&size=32`}
                  alt="Profile"
                />
              </button>

              {profileOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                  <div className="admin-profile-dropdown">
                    <div className="admin-profile-dropdown-header">
                      <div className="admin-profile-dropdown-label">Signed in as</div>
                      <div className="admin-profile-dropdown-email">{user?.email ?? 'Admin'}</div>
                    </div>
                    <Link href="/admin/settings" className="admin-profile-dropdown-item">
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

      {/* Mobile Sidebar Overlay */}
      <div
        className={`admin-sidebar-overlay${sidebarOpen ? ' admin-sidebar-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  )
}
