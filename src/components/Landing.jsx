const features = [
  {
    title: 'Beautiful by default',
    body: 'Clean, Apple-grade invoices your clients will actually enjoy opening. No templates to fight with.',
    icon: 'M12 3l2.5 5.5L20 9.3l-4 4 1 5.7-5-2.8L7 19l1-5.7-4-4 5.5-.8z',
  },
  {
    title: 'Peso-ready, VAT built in',
    body: 'Philippine peso formatting, 12% VAT, discounts and live totals. USD and more when you need them.',
    icon: 'M6 4h7a4 4 0 010 8H6M6 4v16M4 9h10M4 13h10',
  },
  {
    title: 'One-click PDF',
    body: 'Export a crisp A4 PDF straight from your browser. Nothing uploaded, nothing waiting.',
    icon: 'M12 3v12m0 0l-4-4m4 4l4-4M5 19h14',
  },
  {
    title: 'Live preview',
    body: 'See your invoice update as you type. What you see is exactly what your client gets.',
    icon: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  },
  {
    title: 'Saved on your device',
    body: 'Drafts and past invoices stay in your browser. Private, fast, and works offline.',
    icon: 'M5 11V8a7 7 0 0114 0v3M5 11h14v9H5z',
  },
  {
    title: 'Light and dark',
    body: 'A theme for every hour. Your invoice paper stays white so printed PDFs always look right.',
    icon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  },
]

const steps = [
  { n: '01', t: 'Add your details', d: 'Your business, your client, and a few line items.' },
  { n: '02', t: 'Watch it come together', d: 'Totals, VAT and discounts calculate as you type.' },
  { n: '03', t: 'Send it', d: 'Download a polished PDF and you are done.' },
]

const plans = [
  {
    name: 'Starter',
    price: '₱0',
    per: 'forever',
    items: ['Unlimited drafts', 'PDF export', 'Peso and USD', 'Saved on this device'],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '₱299',
    per: 'per month',
    items: ['Everything in Starter', 'Your logo on invoices', 'Cloud sync across devices', 'Recurring invoices', 'Priority support'],
    cta: 'Try Pro free',
    featured: true,
  },
  {
    name: 'Studio',
    price: '₱799',
    per: 'per month',
    items: ['Everything in Pro', 'Up to 5 teammates', 'Client portal', 'Payment reminders'],
    cta: 'Contact us',
    featured: false,
  },
]

export default function Landing({ onStart }) {
  return (
    <main>
      {/* Hero */}
      <section className="wrap pt-40 md:pt-48 pb-20 text-center">
        <div className="fade-up inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5 text-[13px] font-semibold mb-8">
          <span className="rounded-full bg-[color:var(--accent)] text-[color:var(--accent-contrast)] px-2 py-0.5 text-[11px]">New</span>
          One-click PDF export is here
        </div>
        <h1
          className="fade-up font-extrabold tracking-[-0.045em] leading-[1.02] text-[44px] sm:text-[64px] md:text-[80px]"
          style={{ animationDelay: '0.05s' }}
        >
          Invoices, made
          <br />
          <span className="serif-i text-[color:var(--accent)] font-normal">beautiful.</span>
        </h1>
        <p
          className="fade-up mx-auto mt-6 max-w-[560px] text-[17px] md:text-[19px] leading-relaxed text-[color:var(--muted)]"
          style={{ animationDelay: '0.12s' }}
        >
          Gabbers turns a few line items into a pixel-perfect invoice in seconds. Built for freelancers,
          contractors and small studios who want to look as good as their work.
        </p>
        <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.18s' }}>
          <button className="btn btn-accent !text-[15px] !px-6 !py-3" onClick={onStart}>
            Create an invoice
          </button>
          <a href="#features" className="btn btn-ghost !text-[15px] !px-6 !py-3">
            See how it works
          </a>
        </div>

      {/* Product mock */}
        <div className="fade-up mt-16 md:mt-20 card p-3 md:p-4" style={{ animationDelay: '0.26s' }}>
          <div className="rounded-[18px] overflow-hidden border border-[color:var(--border)] bg-white text-left text-[#1d1d1f]">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f5f5f7] border-b border-black/5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[12px] text-black/40 font-semibold">gabbers.app / invoice / INV-0042</span>
            </div>
            <div className="grid md:grid-cols-[1fr_1.15fr]">
              {/* Left: filled-in form */}
              <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/5 space-y-4">
                {[
                  ['Client', 'Acme Corporation'],
                  ['Email', 'accounts@acme.com'],
                  ['Due date', 'Oct 23, 2026'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[11px] font-bold text-black/40 mb-1.5">{label}</div>
                    <div className="h-10 rounded-xl bg-[#f5f5f7] px-3 flex items-center text-[13px] font-semibold">{value}</div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_64px] gap-2">
                  <div>
                    <div className="text-[11px] font-bold text-black/40 mb-1.5">Item</div>
                    <div className="h-10 rounded-xl bg-[#f5f5f7] px-3 flex items-center text-[13px] font-semibold">Website design</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-black/40 mb-1.5">Qty</div>
                    <div className="h-10 rounded-xl bg-[#f5f5f7] px-3 flex items-center text-[13px] font-semibold">1</div>
                  </div>
                </div>
                <div className="h-10 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] text-[13px] font-bold flex items-center justify-center">
                  Download PDF
                </div>
              </div>

              {/* Right: invoice preview */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="serif-i text-[28px] leading-none">Invoice</div>
                    <div className="text-[12px] text-black/45 mt-1 font-semibold">INV-0042</div>
                  </div>
                  <div className="text-right text-[12px] text-black/50 font-semibold">
                    Eduria Studio
                    <br />
                    Manila, PH
                  </div>
                </div>
                <div className="mt-6 space-y-2.5 text-[13px]">
                  {[
                    ['Website design', '₱45,000.00'],
                    ['Development sprint', '₱60,000.00'],
                    ['Hosting setup', '₱5,000.00'],
                  ].map(([a, b]) => (
                    <div key={a} className="flex justify-between border-b border-black/5 pb-2.5">
                      <span className="font-semibold">{a}</span>
                      <span className="tabular-nums text-black/60 font-semibold">{b}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-between items-end">
                  <span className="text-[12px] text-black/45 font-semibold">Total due (incl. 12% VAT)</span>
                  <span className="text-[26px] font-extrabold tracking-tight text-[#7c3aed] tabular-nums">₱123,200.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="wrap py-20 scroll-mt-24">
        <div className="text-center mb-14">
          <p className="text-[13px] font-bold tracking-widest uppercase text-[color:var(--accent)] mb-3">Features</p>
          <h2 className="text-[34px] md:text-[48px] font-extrabold tracking-[-0.035em] leading-[1.05]">
            Everything you need.
            <br />
            <span className="serif-i text-[color:var(--muted)]">Nothing you don't.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-[17px] tracking-tight mb-2">{f.title}</h3>
              <p className="text-[14px] leading-relaxed text-[color:var(--muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="wrap py-20 scroll-mt-24">
        <div className="card p-8 md:p-14">
          <div className="text-center mb-12">
            <p className="text-[13px] font-bold tracking-widest uppercase text-[color:var(--accent)] mb-3">How it works</p>
            <h2 className="text-[30px] md:text-[42px] font-extrabold tracking-[-0.035em] leading-[1.05]">
              From blank page to <span className="serif-i">paid</span> in three steps.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="serif-i text-[44px] text-[color:var(--accent)] leading-none mb-3">{s.n}</div>
                <h3 className="font-bold text-[18px] tracking-tight mb-1.5">{s.t}</h3>
                <p className="text-[14px] text-[color:var(--muted)] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="wrap py-20 scroll-mt-24">
        <div className="text-center mb-14">
          <p className="text-[13px] font-bold tracking-widest uppercase text-[color:var(--accent)] mb-3">Pricing</p>
          <h2 className="text-[34px] md:text-[48px] font-extrabold tracking-[-0.035em] leading-[1.05]">
            Simple, <span className="serif-i">honest</span> pricing.
          </h2>
          <p className="mt-4 text-[color:var(--muted)] text-[15px]">Demo pricing for this portfolio project. Everything is free to try.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card p-7 flex flex-col relative ${p.featured ? 'ring-2 ring-[color:var(--accent)]' : ''}`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-contrast)] text-[11px] font-bold px-3 py-1">
                  Most popular
                </span>
              )}
              <h3 className="font-bold text-[16px]">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[42px] font-extrabold tracking-tight">{p.price}</span>
                <span className="text-[13px] text-[color:var(--muted)] font-semibold">{p.per}</span>
              </div>
              <ul className="mt-6 space-y-3 text-[14px] flex-1">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <svg className="mt-0.5 shrink-0 text-[color:var(--accent)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <button className={`btn mt-8 ${p.featured ? 'btn-accent' : 'btn-dark'}`} onClick={onStart}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wrap py-20">
        <div
          className="rounded-[32px] p-10 md:p-16 text-center text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#6d28d9,#7c3aed 45%,#a78bfa)' }}
        >
          <h2 className="text-[32px] md:text-[48px] font-extrabold tracking-[-0.035em] leading-[1.05]">
            Your next invoice should
            <br />
            <span className="serif-i font-normal">look this good.</span>
          </h2>
          <button className="btn !bg-white !text-[#5b21b6] mt-8 !text-[15px] !px-7 !py-3" onClick={onStart}>
            Create an invoice
          </button>
        </div>
      </section>
    </main>
  )
}
