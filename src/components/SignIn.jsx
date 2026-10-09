import { useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import Logo from './Logo.jsx'
import { auth, firebaseReady } from '../firebase.js'

const ERRORS = {
  'auth/invalid-email': 'That email address does not look right.',
  'auth/missing-password': 'Please enter your password.',
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/user-not-found': 'Wrong email or password.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
  'auth/weak-password': 'Use at least 6 characters for your password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a bit and try again.',
  'auth/network-request-failed': 'Network problem. Check your connection.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled in Firebase yet.',
}

const TITLES = {
  signin: ['Welcome', 'back.'],
  signup: ['Create your', 'account.'],
  reset: ['Reset your', 'password.'],
}

export default function SignIn({ onClose, initialMode = 'signin', inline = false }) {
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)

   useEffect(() => {
    setMode(initialMode)
    setError('')
  }, [initialMode])

  const switchMode = (m) => {
    setMode(m)
    setError('')
    if (m !== 'reset') onModeChange?.(m) 
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!firebaseReady) {
      setError('Firebase is not configured yet. Add your keys to the .env file and restart the dev server.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email.trim(), password)
        if (!inline) onClose()
      } else if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() })
        await sendEmailVerification(cred.user)
        setDone({
          title: 'Check your inbox',
          body: `We sent a verification link to ${email.trim()}. Click it, then come back and press "I've verified" in the app.`,
        })
      } else {
        await sendPasswordResetEmail(auth, email.trim())
        setDone({
          title: 'Reset link sent',
          body: `If an account exists for ${email.trim()}, a password reset email is on its way.`,
        })
      }
    } catch (err) {
      console.error(err)
      setError(ERRORS[err.code] || `Something went wrong (${err.code || err.message}).`)
    } finally {
      setBusy(false)
    }
  }


  const [a, b] = TITLES[mode]

  return (
    <div
      className={
        inline
          ? 'flex items-center justify-center px-4 pt-32 pb-16 min-h-[85vh]'
          : 'fixed inset-0 z-[70] flex items-center justify-center p-4'
      }
      role={inline ? undefined : 'dialog'}
      aria-modal={inline ? undefined : 'true'}
    >
      {!inline && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />}
      <div className="card relative w-full max-w-[420px] p-8 md:p-9 fade-up" style={{ background: 'var(--surface-solid)' }}>
        {!inline && (
          <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full text-[color:var(--muted)]">
            <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        )}
        <div className="mb-6"><Logo /></div>

        {inline && !done && (
          <div className="flex p-1 mb-6 rounded-full border border-[color:var(--border)] text-[13.5px] font-semibold">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 rounded-full transition ${mode !== 'signup' ? 'bg-[color:var(--btn-dark)] text-[color:var(--btn-dark-text)]' : 'text-[color:var(--muted)]'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 rounded-full transition ${mode === 'signup' ? 'bg-[color:var(--btn-dark)] text-[color:var(--btn-dark-text)]' : 'text-[color:var(--muted)]'}`}
            >
              Sign up
            </button>
          </div>
        )}

        {done ? (
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight leading-tight">{done.title}</h2>
            <p className="text-[14px] text-[color:var(--muted)] mt-2 leading-relaxed">{done.body}</p>
            <p className="text-[12.5px] text-[color:var(--muted)] mt-3">Not there? Check your spam folder.</p>
            <button className="btn btn-accent w-full mt-6 !py-3" onClick={onClose}>Got it</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-[26px] font-extrabold tracking-tight leading-tight">
              {a} <span className="serif-i font-normal">{b}</span>
            </h2>
            <p className="text-[13.5px] text-[color:var(--muted)] mt-1.5 mb-6">
              {mode === 'signin' && 'Sign in to save your invoices.'}
              {mode === 'signup' && 'We will email you a link to verify your address.'}
              {mode === 'reset' && 'Enter your email and we will send you a reset link.'}
            </p>

            <div className="space-y-3">
              {mode === 'signup' && (
                <label className="block">
                  <span className="label">Name</span>
                  <input className="field" placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
              )}
              <label className="block">
                <span className="label">Email</span>
                <input type="email" required className="field" placeholder="you@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            {mode !== 'reset' && (
              <label className="block">
                <span className="label">Password</span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="field !pr-11"
                    placeholder="At least 6 characters"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full inline-flex items-center justify-center text-[color:var(--muted)] hover:text-[color:var(--text)] transition"
                  >
                    {showPw ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A10.4 10.4 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 4M6.1 6.1A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004.1-.9" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            )}
            </div>

            {mode === 'signin' && (
              <button type="button" className="mt-3 text-[12.5px] font-semibold text-[color:var(--accent)] hover:underline" onClick={() => switchMode('reset')}>
                Forgot password?
              </button>
            )}

            {error && <p role="alert" className="mt-4 text-[13px] font-semibold text-red-500 leading-snug">{error}</p>}

            <button type="submit" disabled={busy} className="btn btn-accent w-full mt-6 !py-3 disabled:opacity-60">
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
            </button>

            <p className="text-center text-[13px] text-[color:var(--muted)] mt-5 font-semibold">
              {mode === 'signin' && (
                <>New here?{' '}
                  <button type="button" className="text-[color:var(--accent)] hover:underline" onClick={() => switchMode('signup')}>Create an account</button>
                </>
              )}
              {mode === 'signup' && (
                <>Already have an account?{' '}
                  <button type="button" className="text-[color:var(--accent)] hover:underline" onClick={() => switchMode('signin')}>Sign in</button>
                </>
              )}
              {mode === 'reset' && (
                <button type="button" className="text-[color:var(--accent)] hover:underline" onClick={() => switchMode('signin')}>Back to sign in</button>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}