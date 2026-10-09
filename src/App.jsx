import { useEffect, useState } from 'react'
import { onAuthStateChanged, sendEmailVerification, signOut as fbSignOut } from 'firebase/auth'
import Navbar from './components/Navbar.jsx'
import Landing from './components/Landing.jsx'
import InvoiceApp from './components/InvoiceApp.jsx'
import SignIn from './components/SignIn.jsx'
import Footer from './components/Footer.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import { auth } from './firebase.js'

const ROUTES = ['/', '/signin', '/signup', '/dashboard']

const cleanPath = () => {
  const p = location.pathname.replace(/\/+$/, '') || '/'
  return p === '/index.html' ? '/' : p
}

const toUser = (u) =>
  u
    ? {
        uid: u.uid,
        email: u.email,
        name: u.displayName || (u.email || '').split('@')[0],
        verified: u.emailVerified,
      }
    : null

export default function App() {
  const [path, setPath] = useState(cleanPath)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light')
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!auth)

  const navigate = (to, replace = false) => {
    if (replace) history.replaceState(null, '', to)
    else if (to !== cleanPath()) history.pushState(null, '', to)
    setPath(to)
  }

  // Back and forward buttons
  useEffect(() => {
    const onPop = () => setPath(cleanPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('gabbers-theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [path])

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => {
      setUser(toUser(u))
      setAuthReady(true)
    })
  }, [])

  // Signed-in people skip the auth screens, signed-out people can't see the dashboard
  useEffect(() => {
    if (!authReady) return
    if (user && (path === '/signin' || path === '/signup')) navigate('/dashboard', true)
    if (!user && path === '/dashboard') navigate('/signin', true)
  }, [authReady, user, path])

  const isNotFound = !ROUTES.includes(path)
  const view = path === '/' || isNotFound ? 'home' : 'app'
  const authMode = path === '/signup' ? 'signup' : 'signin'

  const signOut = async () => {
    navigate('/')
    if (auth) await fbSignOut(auth)
  }

  const resendVerification = async () => {
    if (auth?.currentUser) await sendEmailVerification(auth.currentUser)
  }

  const refreshUser = async () => {
    if (!auth?.currentUser) return
    await auth.currentUser.reload()
    setUser(toUser(auth.currentUser))
  }

  let body
  if (isNotFound) {
    body = (
      <ErrorPage
        title="This page does not exist."
        message="The page you are looking for cannot be found. It may have been removed or the URL is incorrect."
        onAction={() => navigate('/')}
      />
    )
  } else if (path === '/') {
    body = <Landing onStart={() => navigate(user ? '/dashboard' : '/signup')} />
  } else if (!authReady) {
    body = <div className="min-h-[60vh]" />
  } else if (!user) {
    body = (
      <SignIn
        inline
        initialMode={authMode}
        onModeChange={(m) => navigate(m === 'signup' ? '/signup' : '/signin')}
        onClose={() => navigate('/')}
      />
    )
  } else {
    body = (
      <InvoiceApp
        key={user.uid}
        user={user}
        onRequireSignIn={() => navigate('/signin')}
        onResendVerification={resendVerification}
        onRefreshUser={refreshUser}
      />
    )
  }

  return (
    <>
      <div className="page-bg" />
      <Navbar
        view={view}
        setView={(v) => navigate(v === 'home' ? '/' : '/dashboard')}
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        user={user}
        authMode={authMode}
        onSignIn={() => navigate('/signin')}
        onSignUp={() => navigate('/signup')}
        onSignOut={signOut}
      />
      {body}
      <Footer />
    </>
  )
}