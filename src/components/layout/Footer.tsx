'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mountain } from 'lucide-react'

export default function Footer() {
  const [year, setYear] = useState(2024)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <Mountain size={24} />
              <span>NE India Travel</span>
            </Link>
            <p className="footer-tagline">
              Discover the untouched beauty of Northeast India through authentic homestays, curated packages, and local experiences.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <Link href="/destinations" className="footer-link">Destinations</Link>
            <Link href="/packages" className="footer-link">Tour Packages</Link>
            <Link href="/homestays" className="footer-link">Homestays</Link>
            <Link href="/festivals" className="footer-link">Festival Calendar</Link>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Plan</h4>
            <Link href="/itinerary-builder" className="footer-link">AI Trip Planner</Link>
            <Link href="/permits" className="footer-link">Permit Guide</Link>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">For Hosts</h4>
            <Link href="/host" className="footer-link">Host Portal</Link>
            <Link href="/host/listings/new" className="footer-link">List Your Homestay</Link>
            <Link href="/host/packages/new" className="footer-link">Create a Package</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} NE India Travel. All rights reserved.</p>
          <p className="footer-states">Assam · Meghalaya · Nagaland · Arunachal Pradesh · Manipur · Mizoram · Tripura · Sikkim</p>
        </div>
      </div>
    </footer>
  )
}
