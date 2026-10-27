import React, { useState, useRef, useEffect, useCallback } from 'react'
import { register, login } from '../services/auth'
import type { CurrentUser } from '../services/auth'

interface AuthModalProps {
  initialMode?: 'signin' | 'signup'
  onSuccess: (user: CurrentUser) => void
  onClose: () => void
  dbAvailable: boolean
}

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (pw.length < 8) return { level: 0, label: 'Too short' }
  let score = 0
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (pw.length >= 12) score++
  if (score <= 1) return { level: 1, label: 'Weak' }
  if (score === 2) return { level: 2, label: 'Fair' }
  return { level: 3, label: 'Strong' }
}

export function AuthModal({ initialMode = 'signin', onSuccess, onClose, dbAvailable }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Sign In fields
  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')
  const [siShowPw, setSiShowPw] = useState(false)

  // Sign Up fields
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suShowPw, setSuShowPw] = useState(false)
  const [suShowConfirm, setSuShowConfirm] = useState(false)

  const firstInputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Focus first field on open / mode change
  useEffect(() => {
    const t = setTimeout(() => firstInputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [mode])

  // Keyboard: Escape closes modal
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function switchMode(m: 'signin' | 'signup') {
    setMode(m)
    setServerError('')
    setFieldErrors({})
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose()
  }

  // ── Sign In ──────────────────────────────────────────
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!siEmail.trim()) errs.email = 'Email is required.'
    if (!siPassword) errs.password = 'Password is required.'
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setFieldErrors({})
    setServerError('')
    setIsLoading(true)

    const result = await login(siEmail.trim(), siPassword)
    setIsLoading(false)

    if (result.success && result.user) {
      onSuccess(result.user)
    } else {
      setServerError(result.error || 'Sign in failed. Please try again.')
    }
  }

  // ── Sign Up ──────────────────────────────────────────
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!suName.trim() || suName.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
    if (!suEmail.trim() || !/^\S+@\S+\.\S+$/.test(suEmail.trim())) errs.email = 'Enter a valid email address.'
    if (!suPassword || suPassword.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (suPassword !== suConfirm) errs.confirm = 'Passwords do not match.'
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setFieldErrors({})
    setServerError('')
    setIsLoading(true)

    const result = await register(suName.trim(), suEmail.trim(), suPassword)
    setIsLoading(false)

    if (result.success && result.user) {
      onSuccess(result.user)
    } else if (result.errors && result.errors.length > 0) {
      setServerError(result.errors.join(' '))
    } else {
      setServerError(result.error || 'Registration failed. Please try again.')
    }
  }

  const strength = mode === 'signup' ? getPasswordStrength(suPassword) : null

  const EyeIcon = useCallback(({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      className="auth-eye-btn"
      onClick={onToggle}
      aria-label={show ? 'Hide password' : 'Show password'}
      tabIndex={0}
    >
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  ), [])

  return (
    <div
      ref={overlayRef}
      className="auth-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="auth-card"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'signin' ? 'Sign In to Ocean Explorer' : 'Create your Ocean Explorer account'}
      >
        {/* Close button */}
        <button className="auth-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="brand-mark">◉</span>
          </div>
          <p className="auth-sub">Your deep-sea field journal awaits</p>
        </div>

        {/* DB unavailable notice */}
        {!dbAvailable && (
          <div className="auth-db-notice">
            <span>⚠</span>
            <span>Database offline. Sign In and registration require MongoDB Atlas. Public exploration is still available.</span>
          </div>
        )}

        {/* Mode tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'signin'}
            className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => switchMode('signin')}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Server-level error banner */}
        {serverError && (
          <div className="auth-server-error" role="alert">
            <span>⚠</span> {serverError}
          </div>
        )}

        {/* ── Sign In Form ── */}
        {mode === 'signin' && (
          <form className="auth-form" onSubmit={handleSignIn} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="si-email">Email address</label>
              <input
                id="si-email"
                ref={firstInputRef}
                className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
                type="email"
                autoComplete="email"
                placeholder="explorer@deepocean.io"
                value={siEmail}
                onChange={(e) => { setSiEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })) }}
                disabled={isLoading || !dbAvailable}
              />
              {fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="si-password">Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="si-password"
                  className={`auth-input auth-input-with-icon ${fieldErrors.password ? 'auth-input-error' : ''}`}
                  type={siShowPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={siPassword}
                  onChange={(e) => { setSiPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })) }}
                  disabled={isLoading || !dbAvailable}
                />
                <EyeIcon show={siShowPw} onToggle={() => setSiShowPw(v => !v)} />
              </div>
              {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading || !dbAvailable}
            >
              {isLoading ? <span className="auth-spinner" /> : null}
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="auth-switch-text">
              New explorer?{' '}
              <button type="button" className="auth-switch-link" onClick={() => switchMode('signup')}>
                Create an account
              </button>
            </p>
          </form>
        )}

        {/* ── Sign Up Form ── */}
        {mode === 'signup' && (
          <form className="auth-form" onSubmit={handleSignUp} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="su-name">Full name</label>
              <input
                id="su-name"
                ref={firstInputRef}
                className={`auth-input ${fieldErrors.name ? 'auth-input-error' : ''}`}
                type="text"
                autoComplete="name"
                placeholder="Ocean Explorer"
                value={suName}
                onChange={(e) => { setSuName(e.target.value); setFieldErrors(p => ({ ...p, name: '' })) }}
                disabled={isLoading || !dbAvailable}
              />
              {fieldErrors.name && <span className="auth-field-error">{fieldErrors.name}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="su-email">Email address</label>
              <input
                id="su-email"
                className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
                type="email"
                autoComplete="email"
                placeholder="explorer@deepocean.io"
                value={suEmail}
                onChange={(e) => { setSuEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })) }}
                disabled={isLoading || !dbAvailable}
              />
              {fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="su-password">
                Password
                {suPassword && strength && (
                  <span className={`auth-strength-label level-${strength.level}`}>
                    {strength.label}
                  </span>
                )}
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="su-password"
                  className={`auth-input auth-input-with-icon ${fieldErrors.password ? 'auth-input-error' : ''}`}
                  type={suShowPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={suPassword}
                  onChange={(e) => { setSuPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })) }}
                  disabled={isLoading || !dbAvailable}
                />
                <EyeIcon show={suShowPw} onToggle={() => setSuShowPw(v => !v)} />
              </div>
              {suPassword && strength && (
                <div className="auth-strength-track">
                  <div className={`auth-strength-bar level-${strength.level}`} style={{ width: `${(strength.level / 3) * 100}%` }} />
                </div>
              )}
              {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="su-confirm">Confirm password</label>
              <div className="auth-input-wrapper">
                <input
                  id="su-confirm"
                  className={`auth-input auth-input-with-icon ${fieldErrors.confirm ? 'auth-input-error' : ''}`}
                  type={suShowConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={suConfirm}
                  onChange={(e) => { setSuConfirm(e.target.value); setFieldErrors(p => ({ ...p, confirm: '' })) }}
                  disabled={isLoading || !dbAvailable}
                />
                <EyeIcon show={suShowConfirm} onToggle={() => setSuShowConfirm(v => !v)} />
              </div>
              {fieldErrors.confirm && <span className="auth-field-error">{fieldErrors.confirm}</span>}
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading || !dbAvailable}
            >
              {isLoading ? <span className="auth-spinner" /> : null}
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => switchMode('signin')}>
                Sign in
              </button>
            </p>
          </form>
        )}

        <p className="auth-guest-note">
          You can explore the species catalogue and predictor without an account.
        </p>
      </div>
    </div>
  )
}
