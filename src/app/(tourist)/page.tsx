'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Calendar, Star, Sparkles, ArrowRight } from 'lucide-react'

import { apiFetch } from '@/lib/api'
import { useEffect } from 'react'

const neStates = [
  { name: 'Arunachal', icon: '🏔️' },
  { name: 'Assam', icon: '🦏' },
  { name: 'Manipur', icon: '🌸' },
  { name: 'Meghalaya', icon: '☁️' },
  { name: 'Mizoram', icon: '⛰️' },
  { name: 'Nagaland', icon: '🎭' },
  { name: 'Sikkim', icon: '❄️' },
  { name: 'Tripura', icon: '🏛️' },
]

export default function HomePage() {
  const [featuredDestinations, setFeaturedDestinations] = useState<any[]>([])
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([])
  const [featuredPackages, setFeaturedPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [destRes, festRes, pkgRes] = await Promise.all([
          apiFetch('/api/content/destinations/featured'),
          apiFetch('/api/content/festivals/upcoming'),
          apiFetch('/api/packages')
        ])

        if (destRes.ok) setFeaturedDestinations(await destRes.json())
        if (festRes.ok) setUpcomingFestivals(await festRes.json())
        if (pkgRes.ok) {
          const pkgs = await pkgRes.json()
          setFeaturedPackages(pkgs.slice(0, 3))
        }
      } catch (e) {
        console.error('Failed to fetch home data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        
        <div className="hero-content container">
          <div className="animate-fade-in">
            <span className="hero-badge glass">
              <Sparkles size={16} /> 8 States · Infinite Experiences
            </span>
            <h1 className="hero-title">
              Northeast <br />
              <span className="hero-title-accent">India</span>
            </h1>
            <p className="hero-subtitle">
              Untouched landscapes, vibrant tribal cultures, living root bridges, and festivals you&apos;ve never imagined. Your adventure starts here.
            </p>

            <div className="hero-actions flex gap-4 justify-center items-center">
              <div className="hero-search glass">
                <Search size={20} className="hero-search-icon" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="hero-search-input"
                />
              </div>
              <button className="btn btn-accent btn-lg shadow-lg hover-scale">
                Explore Destinations
              </button>
            </div>
          </div>
        </div>

        {/* Quick Discover Filter */}
        <div className="hero-discover container animate-scale-up">
          <div className="discover-bar glass-dark">
            <span className="discover-label">Quick Discover:</span>
            <div className="discover-list">
              {neStates.map((state) => (
                <Link href={`/destinations?state=${state.name}`} key={state.name} className="discover-item">
                  <span className="discover-icon">{state.icon}</span>
                  <span className="discover-name">{state.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section">
        <div className="container">
          <div className="section-header flex justify-between items-center">
            <div>
              <h2 className="section-title">Must-Visit Destinations</h2>
              <p className="section-subtitle">Handpicked places that will take your breath away</p>
            </div>
            <Link href="/destinations" className="btn btn-outline btn-sm hide-mobile">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="dest-grid">
            {featuredDestinations.map((dest) => (
              <Link href={`/destinations/${dest.slug}`} key={dest.slug} className="dest-card group">
                <div className="dest-card-image">
                  <img src={dest.image || '/images/root-bridges.png'} alt={dest.title} className="dest-img" />
                  <div className="dest-card-overlay" />
                  <span className="badge glass-dark text-white dest-card-state">{dest.state}</span>
                  <div className="dest-card-details">
                    <h3 className="dest-card-title text-white">{dest.title}</h3>
                    <div className="flex items-center gap-1 text-white opacity-80 text-sm">
                      <MapPin size={14} /> Explore Now
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="show-mobile-only mt-6" style={{ textAlign: 'center' }}>
            <Link href="/destinations" className="btn btn-outline">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Festivals */}
      <section className="section festivals-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🎭 Upcoming Festivals</h2>
            <p className="section-subtitle">Experience the living traditions of Northeast India</p>
          </div>

          <div className="festival-grid-modern">
            {upcomingFestivals.map((festival) => (
              <Link href={`/festivals`} key={festival.slug} className="fest-card-elite">
                <div className="fest-date-column">
                  <span className="fest-month-elite">{festival.month || 'DEC'}</span>
                  <span className="fest-day-elite">{festival.day || '01'}</span>
                </div>
                
                <div className="fest-content-column">
                  <div className="fest-header-elite">
                    <span className="badge badge-primary">{festival.state}</span>
                  </div>
                  <h3 className="fest-name-elite">{festival.name}</h3>
                  <p className="fest-desc-elite">{festival.description}</p>
                  
                  <div className="fest-footer-elite">
                    <div className="fest-learn-more">
                      Explore Details <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                <div className="fest-image-column">
                  <div className="fest-image-overlay" />
                  <img 
                    src={festival.image || 'https://images.unsplash.com/photo-1544122159-3b7074747ebc?auto=format&fit=crop&q=80&w=800'} 
                    alt={festival.name} 
                    className="fest-image-elite" 
                  />
                  <div className="fest-icon-badge">{festival.icon || '🎭'}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="section">
        <div className="container">
          <div className="section-header flex justify-between items-center">
            <div>
              <h2 className="section-title">Popular Packages</h2>
              <p className="section-subtitle">Curated experiences by local operators</p>
            </div>
            <Link href="/packages" className="btn btn-outline btn-sm hide-mobile">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pkg-grid">
            {featuredPackages.map((pkg) => (
              <Link href={`/packages/${pkg.slug}`} key={pkg.slug} className="pkg-card card group">
                <div className="pkg-card-image">
                  <img src={pkg.photos?.[0] || pkg.image || '/images/root-bridges.png'} alt={pkg.name} className="dest-img" />
                  <div className="pkg-card-overlay" />
                  <div className="pkg-card-duration glass">
                    <Calendar size={14} /> {pkg.duration_days || pkg.duration} Days
                  </div>
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <p className="pkg-operator">{pkg.operator}</p>
                    <div className="pkg-rating">
                      <Star size={14} fill="currentColor" /> {pkg.rating}
                    </div>
                  </div>
                  <h3 className="pkg-name">{pkg.name}</h3>
                  <div className="pkg-bottom flex justify-between items-end mt-4">
                    <div className="pkg-price-new">
                      <span className="pkg-price-amount">₹{(pkg.total_price || pkg.price).toLocaleString('en-IN')}</span>
                      <span className="pkg-price-label">/ person</span>
                    </div>
                    <button className="btn btn-primary btn-sm rounded-full">Book Now</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Itinerary CTA */}
      <section className="section ai-cta-section">
        <div className="container">
          <div className="ai-cta card">
            <div className="ai-cta-content">
              <span className="badge badge-accent mb-4">✨ AI-Powered</span>
              <h2 className="ai-cta-title">Plan Your Dream Trip in Seconds</h2>
              <p className="ai-cta-desc">
                Tell our AI about your ideal Northeast India trip — budget, interests, duration — and get a personalized day-by-day itinerary instantly.
              </p>
              <Link href="/itinerary-builder" className="btn btn-accent btn-lg mt-4">
                <Sparkles size={20} /> Try AI Trip Planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section community-section">
        <div className="container">
          <div className="community-wave-top">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={`top-${i}`} className="community-avatar-wrapper">
                <div className="avatar-float" style={{ animationDelay: `${i * 0.1}s` }}>
                  <img 
                    src={`https://i.pravatar.cc/150?u=community-top-${i}`} 
                    alt="Community member" 
                    className="community-avatar" 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="community-center">
            <div className="community-logo">
              <div className="community-logo-mark" />
            </div>
            <h2 className="community-title">
              You will find yourself <br /> 
              among us
            </h2>
            <p className="community-subtitle">
              Dive into a dynamic community where travelers <br className="hide-mobile" /> 
              and buyers seamlessly merge.
            </p>
          </div>

          <div className="community-wave-bottom">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={`bottom-${i}`} className="community-avatar-wrapper">
                <div className="avatar-float" style={{ animationDelay: `${i * 0.15}s` }}>
                  <img 
                    src={`https://i.pravatar.cc/150?u=community-bottom-${i}`} 
                    alt="Community member" 
                    className="community-avatar" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="section">
        <div className="container">
          <div className="host-cta">
            <div className="host-cta-content">
              <h2 className="host-cta-title">Own a Homestay or Run Tours?</h2>
              <p className="host-cta-desc">Join our platform and reach travelers from across the world. List your property or create tour packages.</p>
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                <Link href="/host" className="btn btn-primary btn-lg">List Your Homestay</Link>
                <Link href="/host" className="btn btn-outline btn-lg">Create Tour Package</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
