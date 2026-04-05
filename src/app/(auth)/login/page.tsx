'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight, User as UserIcon, Info, Mountain, MapPin, TreePine, Compass } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { persistAuthSessionFromClient } from '@/features/auth/actions'

function LoginContent() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const role = 'tourist'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

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
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      document.cookie = `ne_auth_token=${encodeURIComponent(data.token)}; path=/; max-age=604800; samesite=lax`
      await persistAuthSessionFromClient(data.token)
      handleRedirect()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleRedirect = () => {
    let targetUrl = redirect
    if (email.includes('admin')) {
      targetUrl = '/admin/approvals'
    }
    window.location.href = targetUrl
  }

  return (
    <div className="auth-page">
      {/* Left visual panel */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-content">
          <Link href="/" className="auth-brand">
            <Mountain size={28} />
            <span>NorthEast<strong>Travel</strong></span>
          </Link>

          <div className="auth-visual-text">
            <h2>Discover the unexplored</h2>
            <p>Living root bridges, misty peaks, vibrant festivals, and the warmest hospitality await you in Northeast India.</p>
          </div>

          <div className="auth-visual-features">
            <div className="auth-visual-feature">
              <MapPin size={18} />
              <span>200+ Destinations</span>
            </div>
            <div className="auth-visual-feature">
              <TreePine size={18} />
              <span>Authentic Homestays</span>
            </div>
            <div className="auth-visual-feature">
              <Compass size={18} />
              <span>AI Trip Planning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p>{mode === 'login' ? 'Sign in to access your trips and bookings' : 'Start planning your Northeast India adventure'}</p>
          </div>

          {error && (
            <div className="auth-error">
              <Info size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input-wrap">
                  <UserIcon size={17} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
