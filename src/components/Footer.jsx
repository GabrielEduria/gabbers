import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] mt-8">
      <div className="wrap py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[color:var(--muted)] font-semibold">
        <Logo size={24} />
        <p>
          Built by <span className="serif-i text-[15px] text-[color:var(--text)]">Gabriel Eduria</span>
        </p>
        <p>© {new Date().getFullYear()} Gabbers.</p>
      </div>
    </footer>
  )
}
