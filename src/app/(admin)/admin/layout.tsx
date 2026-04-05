'use client'

import { useState, useEffect } from 'react'
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
  Database,
  Lock,
  HardDrive,
  Cpu,
  Activity,
  Globe,
  Share2
} from 'lucide-react'
import { signOut } from '@/features/auth/actions'
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
    await signOut()
    router.push('/login')
  }

  return (
    <div className="admin-layout-wrapper flex">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.875rem' }}>NorthEastTravel</span>
             <span className="admin-badge admin-badge-free">FREE</span>
           </div>
        </div>
        
        <nav style={{ flex: 1, padding: '0.5rem 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
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
                      className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: isActive ? 'var(--admin-text-main)' : 'inherit' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.subItems && (
                        <span className="ml-auto text-gray-400">
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                      )}
                    </Link>
                    
                    {item.subItems && isExpanded && (
                      <div className="flex flex-col gap-0.5 mb-1">
                        {item.subItems.map(subItem => {
                          const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`admin-nav-sub-item ${isSubActive ? 'active' : ''}`}
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

        {/* Sidebar Footer */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--admin-border-standard)' }}>
          <Link href="/admin/settings" className="admin-nav-item" style={{ margin: 0 }}>
            <Settings size={16} /> <span>Project Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="admin-content-wrapper">
        {/* Top Navigation */}
        <header className="admin-top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="hide-mobile"
              style={{ display: 'none', color: 'var(--admin-text-subtle)', background: 'none', border: 'none' }}
            >
              <Menu size={20} />
            </button>
            <Breadcrumbs />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Connect button */}
            <button className="admin-btn admin-btn-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              <Share2 size={14} /> Connect
            </button>
            
            {/* Search bar */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0 0.75rem',
                height: 32,
                background: 'var(--admin-bg-canvas)',
                border: '1px solid var(--admin-border-standard)',
                borderRadius: 'var(--admin-radius)',
                color: 'var(--admin-text-subtle)',
                fontSize: '0.75rem',
                cursor: 'text',
                width: 200,
                transition: 'all 0.15s ease',
              }}
              className="hover:border-admin-primary/50"
            >
              <Search size={14} style={{ color: 'var(--admin-text-placeholder)' }} />
              <span style={{ color: 'var(--admin-text-placeholder)' }}>Search...</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2px', opacity: 0.4 }}>
                <Command size={10} />
                <span>K</span>
              </div>
            </div>

            {/* Right icon group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderLeft: '1px solid var(--admin-border-standard)', paddingLeft: '0.75rem' }}>
              <button style={{ padding: '6px', background: 'none', border: 'none', color: 'var(--admin-text-subtle)', cursor: 'pointer' }}>
                <HelpCircle size={18} />
              </button>
              <button style={{ padding: '6px', background: 'none', border: 'none', color: 'var(--admin-text-subtle)', cursor: 'pointer' }}>
                <Bell size={18} />
              </button>
              
              {/* Profile avatar */}
              <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--admin-bg-canvas)',
                    border: '1px solid var(--admin-border-standard)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <img 
                    src="https://ui-avatars.com/api/?name=Admin&background=f3f4f6&color=6b7280&size=32" 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
                
                {profileOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                    <div className="animate-fade-in" style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: 0, 
                      marginTop: '0.5rem', 
                      width: 200, 
                      background: '#fff', 
                      border: '1px solid var(--admin-border-standard)', 
                      borderRadius: '0.375rem', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                      zIndex: 50, 
                      overflow: 'hidden',
                      padding: '0.25rem 0', 
                    }}>
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--admin-border-standard)', background: '#fafafa' }}>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signed in as</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--admin-text-main)' }}>admin@netravel.com</div>
                      </div>
                      <Link 
                        href="/admin/settings" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--admin-text-subtle)', textDecoration: 'none' }}
                      >
                        <Settings size={14} /> Account Settings
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-main-content">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  )
}
