'use client'

import { useState, Suspense } from 'react'
import { Mail, Lock, ArrowRight, Home, User as UserIcon, Info, Package, Mountain } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { persistAuthSessionFromClient } from '@/features/auth/actions'
import type { UserRole } from '@/types'

function HostLoginContent() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('homestay_owner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/host/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = mode === 'login'
        ? { email, password }
        : { email, password, name, role }

      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      document.cookie = `ne_auth_token=${encodeURIComponent(data.token)}; path=/; max-age=604800; samesite=lax`
      await persistAuthSessionFromClient(data.token)
      window.location.href = redirect
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const isOperator = role === 'operator'

  return (
    <div className="auth-page">
      {/* Left visual panel */}
      <div className="auth-visual" style={{ background: '#0f172a' }}>
        <div className="auth-visual-bg" style={{ backgroundImage: "url('/hero.png')", opacity: 0.25 }} />
        <div className="auth-visual-content">
          <Link href="/" className="auth-brand">
            <Mountain size={28} />
            <span>NorthEast<strong>Travel</strong></span>
          </Link>

          <div className="auth-visual-text">
            <h2>Grow your business with us</h2>
            <p>
              {isOperator
                ? 'Create and manage tour packages across Northeast India. Reach thousands of travellers looking for authentic experiences.'
                : 'List your property on our platform and welcome travellers from across the globe to experience authentic Northeast Indian hospitality.'}
            </p>
          </div>

          <div className="auth-visual-features">
            <div className="auth-visual-feature">
              <Home size={18} />
              <span>Easy Listing</span>
            </div>
            <div className="auth-visual-feature">
              <Package size={18} />
              <span>Package Builder</span>
            </div>
            <div className="auth-visual-feature">
              <ArrowRight size={18} />
              <span>Instant Bookings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>{mode === 'login' ? 'Host Sign In' : 'Become a Host'}</h1>
            <p>{mode === 'login' ? 'Enter your credentials to access your dashboard' : 'Create an account to start hosting travellers'}</p>
          </div>

          {error && (
            <div className="auth-error">
              <Info size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <>
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="auth-input-wrap">
                    <UserIcon size={17} />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Role selector */}
                <div className="auth-field">
                  <label>I want to...</label>
                  <div className="auth-role-picker">
                    <button
                      type="button"
                      className={`auth-role-option${role === 'homestay_owner' ? ' active' : ''}`}
                      onClick={() => setRole('homestay_owner')}
                    >
                      <Home size={20} />
                      <span className="auth-role-option-title">List a Property</span>
                      <span className="auth-role-option-desc">Homestay owner</span>
                    </button>
                    <button
                      type="button"
                      className={`auth-role-option${role === 'operator' ? ' active' : ''}`}
                      onClick={() => setRole('operator')}
                    >
                      <Package size={20} />
                      <span className="auth-role-option-title">Create Tours</span>
                      <span className="auth-role-option-desc">Tour operator</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={17} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="auth-forgot">
                <button type="button">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="auth-toggle"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          <p className="auth-terms">
            By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HostLoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    }>
      <HostLoginContent />
    </Suspense>
  )
}
