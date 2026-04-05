'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Package, Calendar, Inbox, DollarSign, Star, LogOut, Menu, X, Mountain } from 'lucide-react'

const navItems = [
  { href: '/host/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { href: '/host/listings/new', icon: <Home size={20} />, label: 'My Listing' },
  { href: '/host/packages/new', icon: <Package size={20} />, label: 'My Packages' },
  { href: '/host/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
  { href: '/host/bookings', icon: <Inbox size={20} />, label: 'Bookings' },
  { href: '/host/earnings', icon: <DollarSign size={20} />, label: 'Earnings' },
  { href: '/host/reviews', icon: <Star size={20} />, label: 'Reviews' },
]

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="host-layout">
      {/* Mobile Header */}
      <header className="host-mobile-header show-mobile-only">
        <Link href="/host/dashboard" className="host-logo">
          <Mountain size={24} /> Host Portal
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`host-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="host-sidebar-header hide-mobile">
          <Link href="/host/dashboard" className="host-logo">
            <div className="logo-icon">
              <Mountain size={20} />
            </div>
            <span>Host Portal</span>
          </Link>
        </div>
        <nav className="host-nav">
          <div className="nav-section-label">Main Menu</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`host-nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="nav-item-content">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
              {pathname.startsWith(item.href) && <div className="active-indicator" />}
            </Link>
          ))}
        </nav>
        <div className="host-sidebar-footer">
          <Link href="/" className="host-nav-item logout-item">
            <div className="nav-item-content">
              <span className="nav-icon"><LogOut size={20} /></span>
              <span className="nav-label">Sign Out</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="host-main">
        <div className="main-content-wrapper">
          {children}
        </div>
      </main>

      {sidebarOpen && <div className="host-overlay show-mobile-only" onClick={() => setSidebarOpen(false)} />}

      <style jsx>{`
        .host-layout { 
          display: flex; 
          min-height: 100vh; 
          background-color: #f8fafc; 
        }

        .host-mobile-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; padding: 0 1.5rem;
          background: rgba(255, 255, 255, 0.9); 
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border);
        }

        .host-logo {
          display: flex; align-items: center; gap: 0.875rem;
          font-family: var(--font-family-display);
          font-weight: 800; color: white;
          font-size: 1.25rem;
          letter-spacing: -0.01em;
        }

        .logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(145deg, var(--color-primary-light), var(--color-primary));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25), inset 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .host-sidebar {
          position: fixed; left: 0; top: 0; bottom: 0;
          width: 280px; background: linear-gradient(180deg, var(--color-forest-950) 0%, #022010 100%);
          display: flex; flex-direction: column;
          z-index: 40;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 12px 0 40px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .host-sidebar {
            transform: translateX(-100%);
            top: 64px;
            width: 100%;
          }
          .host-sidebar.open { transform: translateX(0); }
        }

        .host-sidebar-header {
          padding: 2.25rem 1.75rem;
          margin-bottom: 1.25rem;
        }

        .nav-section-label {
          padding: 0 1.75rem;
          margin-bottom: 1rem;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.25);
        }

        .host-nav {
          flex: 1; padding: 0 1rem;
          display: flex; flex-direction: column; gap: 0.35rem;
        }

        .host-nav-item {
          position: relative;
          display: block;
          padding: 0.85rem 1.15rem;
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.55);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 1.15rem;
          position: relative;
          z-index: 2;
        }

        .host-nav-item:hover { 
          background: rgba(255, 255, 255, 0.04); 
          color: rgba(255, 255, 255, 0.9); 
          transform: translateX(4px);
        }

        .host-nav-item.active { 
          background: rgba(255, 255, 255, 0.08); 
          color: white; 
          font-weight: 600; 
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .nav-icon {
          display: flex; align-items: center; justify-content: center;
          width: 20px;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .host-nav-item:hover .nav-icon,
        .host-nav-item.active .nav-icon {
          opacity: 1;
          color: var(--color-primary-light);
          filter: drop-shadow(0 0 8px rgba(22, 163, 74, 0.4));
        }

        .nav-label {
          font-size: 0.95rem;
          letter-spacing: 0.01em;
        }

        .active-indicator {
          position: absolute; right: 12px; top: 18px; bottom: 18px;
          width: 5px; background: var(--color-primary-light);
          border-radius: 10px;
          box-shadow: 0 0 12px rgba(22, 163, 74, 0.6);
        }

        .host-sidebar-footer { 
          padding: 1.5rem 1rem; 
          border-top: 1px solid rgba(255, 255, 255, 0.05); 
          margin-top: auto;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          transform: none;
        }

        .host-main {
          flex: 1; margin-left: 280px; 
          min-height: 100vh;
        }

        .main-content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3.5rem 4rem;
        }

        @media (max-width: 1024px) {
          .main-content-wrapper { padding: 3rem 2rem; }
        }

        @media (max-width: 768px) {
          .host-main { margin-left: 0; }
          .main-content-wrapper { padding: 6.5rem 1.5rem 2.5rem; }
          .active-indicator { display: none; }
        }

        .host-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          z-index: 30; top: 64px;
        }
      `}</style>
    </div>
  )
}
