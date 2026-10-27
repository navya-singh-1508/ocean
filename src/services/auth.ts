/**
 * Authentication service — all auth API calls use HTTP-only cookies.
 * Credentials are NEVER stored in localStorage.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export interface CurrentUser {
  id: string
  name: string
  email: string
  favoriteSpeciesSlugs: string[]
}

export interface AuthResult {
  success: boolean
  user?: CurrentUser
  error?: string
  errors?: string[]
}

/** Register a new account */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
    })
    const data = await res.json()
    return data as AuthResult
  } catch {
    return { success: false, error: 'Network error — please check your connection and try again.' }
  }
}

/** Sign in with email and password */
export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.trim(), password })
    })
    const data = await res.json()
    return data as AuthResult
  } catch {
    return { success: false, error: 'Network error — please check your connection and try again.' }
  }
}

/** Sign out — clears the HTTP-only cookie on the server */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch {
    // Ignore network errors on logout
  }
}

/** Restore session from existing JWT cookie (called on app mount) */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: 'include',
      signal: controller.signal
    })
    clearTimeout(timeout)
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.user) return data.user as CurrentUser
    }
  } catch {
    // Not signed in or backend unavailable — that's fine
  }
  return null
}

/** Sync a favorite toggle to the server (requires sign-in) */
export async function syncFavorite(
  slug: string,
  action: 'add' | 'remove'
): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/me/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ slug, action })
    })
    if (res.ok) {
      const data = await res.json()
      if (data.success) return data.favorites as string[]
    }
  } catch (err) {
    console.warn('[Auth] Failed to sync favorite:', err)
  }
  return null
}
