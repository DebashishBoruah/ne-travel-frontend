'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Mountain, Search, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner container">
        <Link href="/" className="header-logo animate-fade-in">
          <div className="logo-icon-wrapper">
            <Mountain size={28} className="logo-icon" />
          </div>
          <span className="logo-text">NE India Travel</span>
        </Link>

        <nav className="header-nav hide-mobile">
          <Link href="/destinations" className="header-nav-link">Destinations</Link>
          <Link href="/packages" className="header-nav-link">Packages</Link>
          <Link href="/homestays" className="header-nav-link">Homestays</Link>
          <Link href="/festivals" className="header-nav-link">Festivals</Link>
          <Link href="/itinerary-builder" className="header-nav-link header-nav-link--accent">AI Planner</Link>
          <Link href="/permits" className="header-nav-link">Permits</Link>
        </nav>

        <div className="header-actions hide-mobile">
          <Link href="/login" className="btn btn-ghost btn-sm">
            <User size={18} />
            Login
          </Link>
        </div>

        <button
          className="header-menu-btn show-mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu show-mobile-only">
          <nav className="mobile-menu-nav">
            <Link href="/destinations" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Destinations</Link>
            <Link href="/packages" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Packages</Link>
            <Link href="/homestays" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Homestays</Link>
            <Link href="/festivals" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Festivals</Link>
            <Link href="/itinerary-builder" className="mobile-menu-link mobile-menu-link--accent" onClick={() => setIsMenuOpen(false)}>AI Trip Planner</Link>
            <Link href="/permits" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Permits</Link>
            <div className="mobile-menu-divider" />
            <Link href="/login" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <User size={18} /> Login / Sign Up
            </Link>
          </nav>
        </div>
      )}

    </header>
  )
}
