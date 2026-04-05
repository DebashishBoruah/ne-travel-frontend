'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Mountain, User, Sparkles, ChevronRight } from 'lucide-react'

const NAV_LINKS = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/homestays', label: 'Homestays' },
  { href: '/packages', label: 'Packages' },
  { href: '/festivals', label: 'Festivals' },
  { href: '/permits', label: 'Permits' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const onScroll = useCallback(() => setScrolled(window.scrollY > 40), [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  useEffect(() => setOpen(false), [pathname])

  const active = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const headerCls = [
    'site-header',
    scrolled ? 'site-header--solid' : '',
    isHome && !scrolled ? 'site-header--transparent' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={headerCls}>
      <div className="site-header-inner container">
        <Link href="/" className="site-logo">
          <span className="site-logo-icon"><Mountain size={20} /></span>
          <span className="site-logo-text">NorthEast<span className="site-logo-accent">Travel</span></span>
        </Link>

        <nav className="site-nav hide-mobile">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`site-nav-link${active(l.href) ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/itinerary-builder" className={`site-nav-cta${active('/itinerary-builder') ? ' active' : ''}`}>
            <Sparkles size={13} /> AI Planner
          </Link>
        </nav>

        <div className="site-header-actions hide-mobile">
          <Link href="/login" className="site-login-btn">
            <User size={16} /> Sign in
          </Link>
        </div>

        <button className="site-hamburger show-mobile-only" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="site-mobile-menu show-mobile-only">
          <nav className="site-mobile-nav">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`site-mobile-link${active(l.href) ? ' active' : ''}`}>
                {l.label} <ChevronRight size={16} className="site-mobile-link-arrow" />
              </Link>
            ))}
            <Link href="/itinerary-builder" className="site-mobile-link site-mobile-link--accent">
              <Sparkles size={16} /> AI Trip Planner <ChevronRight size={16} className="site-mobile-link-arrow" />
            </Link>
            <div className="site-mobile-divider" />
            <Link href="/login" className="site-mobile-link">
              <User size={16} /> Sign in <ChevronRight size={16} className="site-mobile-link-arrow" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
