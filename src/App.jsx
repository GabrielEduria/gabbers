import { useEffect, useState } from 'react'
import { onAuthStateChanged, sendEmailVerification, signOut as fbSignOut } from 'firebase/auth'
import Navbar from './components/Navbar.jsx'
import Landing from './components/Landing.jsx'
import InvoiceApp from './components/InvoiceApp.jsx'
import SignIn from './components/SignIn.jsx'
import Footer from './components/Footer.jsx'
import { auth } from './firebase.js'
import ErrorPage from './components/ErrorPage.jsx'

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
  const [view, setView] = useState(() => (location.hash === '#app' ? 'app' : 'home'))
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light')
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!auth)
  const [authMode, setAuthMode] = useState('signin')
  const isNotFound = !['/', '/index.html'].includes(location.pathname)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('gabbers-theme', theme) } catch {}
  }, [theme])

  useEffect(() => {
    history.replaceState(null, '', view === 'app' ? '#app' : location.pathname)
    window.scrollTo({ top: 0 })
  }, [view])

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => {
      setUser(toUser(u))
      setAuthReady(true)
    })
  }, [])

  const goSignIn = () => { setAuthMode('signin'); setView('app') }
  const goSignUp = () => { setAuthMode('signup'); setView('app') }

  const signOut = async () => {
    if (auth) await fbSignOut(auth)
    setView('home')
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

  if(isNotFound) {
    body = (
      <ErrorPage
        title="This page does not exist."
        message="The page your are looking for cannot be found. It may have been removed or the URL is incorrect."
        onAction={() => window.location.assign('/')}
      />
    )
  } else if (view === 'home') {
    body = <Landing onStart={user ? () => setView('app') : goSignUp} />
  } else if (!authReady) {
    body = <div className="min-h-[60vh]" />
  } else if (!user) {
    body = <SignIn inline initialMode={authMode} onModeChange={setAuthMode} onClose={() => setView('home')} />
  } else {
    body = (
      <InvoiceApp
        key={user.uid}
        user={user}
        onRequireSignIn={goSignIn}
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
        setView={setView}
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        user={user}
        authMode={authMode}
        onSignIn={goSignIn}
        onSignUp={goSignUp}
        onSignOut={signOut}
      />
      {body}
      <Footer />
    </>
  )
}