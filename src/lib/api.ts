function readNeAuthTokenFromDocument(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )ne_auth_token=([^;]*)/)
  if (!match?.[1]) return null
  const raw = match[1].trim()
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)

  // In the browser, try to extract ne_auth_token
  if (typeof window !== 'undefined') {
    const token = readNeAuthTokenFromDocument()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  } else {
    // In SSR, try to read from next/headers
    try {
      const { cookies } = require('next/headers')
      const cookieStore = await cookies()
      const token = cookieStore.get('ne_auth_token')?.value
      if (token) headers.set('Authorization', `Bearer ${token}`)
    } catch (e) {
      // Ignore
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  })

  return response
}
