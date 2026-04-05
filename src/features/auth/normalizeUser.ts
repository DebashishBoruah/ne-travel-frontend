import type { User, UserRole } from '@/types'

const ROLES: UserRole[] = ['tourist', 'operator', 'homestay_owner', 'admin']

function isUserRole(v: unknown): v is UserRole {
  return typeof v === 'string' && (ROLES as string[]).includes(v)
}

/** Map common API / legacy string values to UserRole */
function coerceRole(v: unknown): UserRole | undefined {
  if (isUserRole(v)) return v
  if (typeof v !== 'string') return undefined
  const s = v.trim().toLowerCase().replace(/\s+/g, '_')
  if (s === 'operator' || s === 'tour_operator') return 'operator'
  if (s === 'homestay_owner' || s === 'host' || s === 'homestay') return 'homestay_owner'
  if (s === 'admin') return 'admin'
  if (s === 'tourist' || s === 'traveler' || s === 'traveller') return 'tourist'
  return undefined
}

function extractRoleFromObject(o: Record<string, unknown>): UserRole | undefined {
  const keys = ['role', 'user_role', 'userRole', 'user_type', 'userType', 'type']
  for (const k of keys) {
    const r = coerceRole(o[k])
    if (r) return r
  }
  return undefined
}

/** Decode JWT payload (no verification — UI only; API still validates). */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const json =
      typeof Buffer !== 'undefined'
        ? Buffer.from(b64, 'base64').toString('utf8')
        : atob(b64)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Normalizes `/api/auth/me` (and login) user JSON + optional JWT so `role` is reliable.
 * Backends often use snake_case, omit `role` on `/me`, or put `role` only in the token.
 */
export function normalizeAuthUser(raw: unknown, token?: string | null): User | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  let id = o.id ?? o.user_id ?? o.userId
  if ((id === undefined || id === null || String(id) === '') && token) {
    const payload = parseJwtPayload(token)
    if (payload) {
      id = payload.sub ?? payload.user_id ?? payload.id ?? payload.userId
    }
  }
  if (id === undefined || id === null || String(id) === '') return null

  let role = extractRoleFromObject(o)
  if (!role && token) {
    const payload = parseJwtPayload(token)
    if (payload) role = extractRoleFromObject(payload)
  }
  if (!role) role = 'tourist'

  return {
    id: String(id),
    phone: (o.phone as string) ?? null,
    email: (o.email as string) ?? null,
    role,
    name: (o.name as string) ?? null,
    bio: (o.bio as string) ?? null,
    avatar_url: (o.avatar_url as string) ?? (o.avatarUrl as string) ?? null,
    bank_details: (o.bank_details as User['bank_details']) ?? (o.bankDetails as User['bank_details']) ?? null,
    created_at: String(o.created_at ?? o.createdAt ?? new Date().toISOString()),
  }
}

/** Pick user object from various API response shapes. */
export function pickUserFromMeResponse(data: Record<string, unknown>): unknown {
  let inner: unknown = null
  if (data.user && typeof data.user === 'object') inner = data.user
  else if (data.profile && typeof data.profile === 'object') inner = data.profile
  else if (data.data && typeof data.data === 'object') inner = data.data
  else if (data.id != null || data.email != null) inner = data

  if (inner && typeof inner === 'object') {
    const o = inner as Record<string, unknown>
    if (!extractRoleFromObject(o)) {
      const fromRoot = extractRoleFromObject(data)
      if (fromRoot) return { ...o, role: fromRoot }
    }
  }
  return inner
}
