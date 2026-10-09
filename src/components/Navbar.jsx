import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'


const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export default function Navbar({ view, setView, theme, toggleTheme, user, onSignIn, onSignUp, onSignOut, authMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const onAuthPage = view === 'app' && !user
  const signInSelected = onAuthPage && authMode === 'signin'
  const signUpSelected = !onAuthPage || authMode === 'signup'
  const inApp = view === 'app' && !!user

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id) => {
    setOpen(false)
    if (view !== 'home') {
      setView('home')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const linkCls =
    'px-3.5 py-1.5 rounded-full text-[13.5px] font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/10 transition'

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <div className="w-full max-w-[960px] pointer-events-auto">
        <nav
          className="glass flex items-center justify-between rounded-full pl-4 pr-2 py-2 transition-shadow"
          style={{ boxShadow: scrolled ? 'var(--shadow)' : 'none' }}
        >
          <button onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Gabbers home">
            <Logo />
          </button>

        <div className="hidden md:flex items-center gap-1">
        {inApp ? (
          <>
            <button className={linkCls + ' text-left'} onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>New invoice</button>
            <button className={linkCls + ' text-left'} onClick={() => { setOpen(false); document.getElementById('saved')?.scrollIntoView({ behavior: 'smooth' }) }}>Saved invoices</button>
            <button className={linkCls + ' text-left'} onClick={() => { setOpen(false); setView('home') }}>Home</button>
          </>
        ) : (
          <>
            <button className={linkCls + ' text-left'} onClick={() => go('features')}>Features</button>
            <button className={linkCls + ' text-left'} onClick={() => go('how')}>How it works</button>
            <button className={linkCls + ' text-left'} onClick={() => go('pricing')}>Pricing</button>
          </>
        )}
        </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/10 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              inApp ? (
                <button className="btn btn-ghost !py-2" onClick={onSignOut}>Sign out</button>
              ) : (
                <>
                  <button className="hidden sm:inline-flex btn btn-ghost !py-2" onClick={onSignOut}>Sign out</button>
                  <button className="btn btn-accent !py-2" onClick={() => setView('app')}>Open app</button>
                </>
              )
            ) : (
              <>
                <button
                  className={`hidden sm:inline-flex btn !py-2 ${signInSelected ? 'btn-dark' : 'text-[color:var(--text)]'}`}
                  onClick={onSignIn}
                >
                  Sign in
                </button>
                <button
                  className={`btn !py-2 ${signUpSelected ? 'btn-dark' : 'text-[color:var(--text)]'}`}
                  onClick={onSignUp}
                >
                  Sign up
                </button>
              </>
            )}
            <button
              className="md:hidden w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass md:hidden mt-2 rounded-3xl p-3 flex flex-col fade-up">
            <button className={linkCls + ' text-left'} onClick={() => go('features')}>Features</button>
            <button className={linkCls + ' text-left'} onClick={() => go('how')}>How it works</button>
            <button className={linkCls + ' text-left'} onClick={() => go('pricing')}>Pricing</button>
          {!user && (
            <>
              <button className={linkCls + ' text-left'} onClick={() => { setOpen(false); onSignIn() }}>Sign in</button>
              <button className={linkCls + ' text-left'} onClick={() => { setOpen(false); onSignUp() }}>Sign up</button>
            </>
          )}
            {user && (
              <button className={linkCls + ' text-left'} onClick={() => { setOpen(false); onSignOut() }}>Sign out</button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
