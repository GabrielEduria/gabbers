import { Component } from 'react'

export default function ErrorPage({ code = '404', title, message, actionLabel = 'Back to home', onAction }) {
  return (
    <main className="flex items-center justify-center px-4 pt-32 pb-16 min-h-[85vh] text-center">
      <div className="fade-up max-w-[460px]">
        <div className="serif-i text-[96px] md:text-[120px] leading-none text-[color:var(--accent)]">{code}</div>
        <h1 className="mt-4 text-[28px] md:text-[34px] font-extrabold tracking-[-0.03em] leading-tight">{title}</h1>
        <p className="mt-3 text-[15px] text-[color:var(--muted)] leading-relaxed">{message}</p>
        <button className="btn btn-accent mt-8 !px-6 !py-3" onClick={onAction}>{actionLabel}</button>
      </div>
    </main>
  )
}

// Catches crashes anywhere in the app and shows a friendly page instead of a blank screen
export class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.error(err)
  }
  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <>
        <div className="page-bg" />
        <ErrorPage
          code="Oops"
          title="Something went wrong."
          message="An unexpected error happened. Reloading usually fixes it."
          actionLabel="Reload Gabbers"
          onAction={() => window.location.assign('/')}
        />
      </>
    )
  }
}