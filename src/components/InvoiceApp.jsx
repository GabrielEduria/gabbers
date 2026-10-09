import { useEffect, useMemo, useRef, useState } from 'react'
import InvoicePaper, { CURRENCIES, calcTotals, money } from './InvoicePaper.jsx'

const KEY_DRAFT = 'gabbers-draft'
const KEY_SAVED = 'gabbers-saved'

const todayStr = (add = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + add)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const uid = () => Math.random().toString(36).slice(2, 9)

const makeDraft = (n = 1) => ({
  id: uid(),
  number: `INV-${String(n).padStart(4, '0')}`,
  issueDate: todayStr(),
  dueDate: todayStr(14),
  currency: 'PHP',
  taxRate: 12,
  discount: 0,
  notes: 'Thank you for your business. Payment is due within 14 days.',
  payment: { wiseEmail: '', wiseLink: '', details: '' },
  from: { name: 'Gabriel Eduria', email: 'gabrielezekieleduria@gmail.com', address: 'Manila, Metro Manila\nPhilippines' },
  client: { name: '', email: '', address: '' },
  items: [
    { id: uid(), desc: 'Website design', qty: 1, price: 45000 },
    { id: uid(), desc: 'Frontend development', qty: 1, price: 60000 },
  ],
})

const load = (k, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(k))
    return v ?? fallback
  } catch {
    return fallback
  }
}
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}

export default function InvoiceApp({ user, onRequireSignIn }) {
  const [saved, setSaved] = useState(() => load(KEY_SAVED, []))
  const [inv, setInv] = useState(() => load(KEY_DRAFT, null) || makeDraft(load(KEY_SAVED, []).length + 1))
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const paperRef = useRef(null)
  const previewBox = useRef(null)
  const [scale, setScale] = useState(0.6)

  useEffect(() => save(KEY_DRAFT, inv), [inv])
  useEffect(() => save(KEY_SAVED, saved), [saved])

  useEffect(() => {
    const el = previewBox.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / 794)))
    ro.observe(el)
    setScale(Math.min(1, el.clientWidth / 794))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const totals = useMemo(() => calcTotals(inv), [inv])

  const set = (patch) => setInv((v) => ({ ...v, ...patch }))
  const setFrom = (patch) => setInv((v) => ({ ...v, from: { ...v.from, ...patch } }))
  const setPayment = (patch) => setInv((v) => ({ ...v, payment: { ...(v.payment || {}), ...patch } }))
  const setClient = (patch) => setInv((v) => ({ ...v, client: { ...v.client, ...patch } }))
  const setItem = (id, patch) =>
    setInv((v) => ({ ...v, items: v.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }))
  const addItem = () => setInv((v) => ({ ...v, items: [...v.items, { id: uid(), desc: '', qty: 1, price: 0 }] }))
  const removeItem = (id) =>
    setInv((v) => ({ ...v, items: v.items.length > 1 ? v.items.filter((i) => i.id !== id) : v.items }))

  const saveInvoice = () => {
    if (!user) return onRequireSignIn()
    setSaved((s) => {
      const exists = s.some((x) => x.id === inv.id)
      const row = { ...inv, savedAt: Date.now() }
      return exists ? s.map((x) => (x.id === inv.id ? row : x)) : [row, ...s]
    })
    setToast('Invoice saved')
  }

  const newInvoice = () => {
    const next = makeDraft(saved.length + 1)
    next.from = inv.from
    next.currency = inv.currency
    next.taxRate = inv.taxRate
    setInv(next)
    setToast('New invoice started')
  }

  const loadInvoice = (row) => {
    const { savedAt, ...rest } = row
    setInv(rest)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteInvoice = (id) => setSaved((s) => s.filter((x) => x.id !== id))

  const downloadPdf = async () => {
    if (!paperRef.current) return
    setBusy(true)
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
      if (document.fonts?.ready) await document.fonts.ready
      const canvas = await html2canvas(paperRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true })
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width
      const img = canvas.toDataURL('image/jpeg', 0.95)
      let y = 0
      pdf.addImage(img, 'JPEG', 0, y, pageW, imgH)
      let left = imgH - pageH
      while (left > 1) {
        y -= pageH
        pdf.addPage()
        pdf.addImage(img, 'JPEG', 0, y, pageW, imgH)
        left -= pageH
      }
      pdf.save(`${inv.number || 'invoice'}.pdf`)
      setToast('PDF downloaded')
    } catch (e) {
      console.error(e)
      setToast('Could not create PDF')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="wrap pt-28 md:pt-32 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8 fade-up">
        <div>
          <p className="text-[13px] font-bold tracking-widest uppercase text-[color:var(--accent)] mb-2">Dashboard</p>
          <h1 className="text-[32px] md:text-[44px] font-extrabold tracking-[-0.035em] leading-none">
            New <span className="serif-i">invoice</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost" onClick={newInvoice}>New</button>
          <button className="btn btn-ghost" onClick={saveInvoice}>Save</button>
          <button className="btn btn-accent" onClick={downloadPdf} disabled={busy}>
            {busy ? 'Creating PDF…' : 'Download PDF'}
          </button>
        </div>
      </div>

  
      <div className="grid grid-cols-3 gap-3 mb-6 fade-up" style={{ animationDelay: '0.05s' }}>
        <Stat label="Current total" value={money(totals.total, inv.currency)} accent />
        <Stat label="Line items" value={inv.items.length} />
        <Stat label="Saved invoices" value={saved.length} />
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6 items-start">
  
        <div className="space-y-4 fade-up" style={{ animationDelay: '0.1s' }}>
          <Section title="Invoice">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Number">
                <input className="field" value={inv.number} onChange={(e) => set({ number: e.target.value })} />
              </Field>
              <Field label="Currency">
                <select className="field" value={inv.currency} onChange={(e) => set({ currency: e.target.value })}>
                  {Object.entries(CURRENCIES).map(([k, c]) => (
                    <option key={k} value={k}>{k} ({c.symbol})</option>
                  ))}
                </select>
              </Field>
              <Field label="Issue date">
                <input type="date" className="field" value={inv.issueDate} onChange={(e) => set({ issueDate: e.target.value })} />
              </Field>
              <Field label="Due date">
                <input type="date" className="field" value={inv.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section title="From">
            <div className="space-y-3">
              <Field label="Business name"><input className="field" value={inv.from.name} onChange={(e) => setFrom({ name: e.target.value })} /></Field>
              <Field label="Email"><input className="field" value={inv.from.email} onChange={(e) => setFrom({ email: e.target.value })} /></Field>
              <Field label="Address"><textarea rows={2} className="field resize-none" value={inv.from.address} onChange={(e) => setFrom({ address: e.target.value })} /></Field>
            </div>
          </Section>

          <Section title="Bill to">
            <div className="space-y-3">
              <Field label="Client name"><input className="field" placeholder="Acme Corporation" value={inv.client.name} onChange={(e) => setClient({ name: e.target.value })} /></Field>
              <Field label="Email"><input className="field" placeholder="accounts@acme.com" value={inv.client.email} onChange={(e) => setClient({ email: e.target.value })} /></Field>
              <Field label="Address"><textarea rows={2} className="field resize-none" value={inv.client.address} onChange={(e) => setClient({ address: e.target.value })} /></Field>
            </div>
          </Section>

          <Section title="Items">
            <div className="space-y-3">
              {inv.items.map((i, idx) => (
                <div key={i.id} className="rounded-2xl border border-[color:var(--border)] p-3 space-y-2.5">
                  <div className="flex gap-2">
                    <input className="field" placeholder={`Item ${idx + 1} description`} value={i.desc} onChange={(e) => setItem(i.id, { desc: e.target.value })} />
                    <button
                      className="shrink-0 w-10 rounded-xl text-[color:var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition"
                      onClick={() => removeItem(i.id)}
                      aria-label="Remove item"
                    >
                      <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <input type="number" min="0" className="field" aria-label="Quantity" value={i.qty} onChange={(e) => setItem(i.id, { qty: e.target.value })} />
                    <input type="number" min="0" className="field" aria-label="Price" value={i.price} onChange={(e) => setItem(i.id, { price: e.target.value })} />
                  </div>
                  <div className="text-right text-[12px] font-semibold text-[color:var(--muted)] tabular-nums">
                    {money((Number(i.qty) || 0) * (Number(i.price) || 0), inv.currency)}
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost w-full" onClick={addItem}>+ Add item</button>
            </div>
          </Section>

          <Section title="Tax, discount and notes">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Tax rate (%)"><input type="number" min="0" className="field" value={inv.taxRate} onChange={(e) => set({ taxRate: e.target.value })} /></Field>
              <Field label="Discount (amount)"><input type="number" min="0" className="field" value={inv.discount} onChange={(e) => set({ discount: e.target.value })} /></Field>
            </div>
            <Field label="Notes"><textarea rows={3} className="field resize-none" value={inv.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
          </Section>
          <Section title="Payment (Wise)">
            <div className="space-y-3">
              <Field label="Wise email">
                <input className="field" placeholder="you@email.com" value={inv.payment?.wiseEmail || ''} onChange={(e) => setPayment({ wiseEmail: e.target.value })} />
              </Field>
              <Field label="Wise payment link">
                <input className="field" placeholder="Paste your Wise payment link" value={inv.payment?.wiseLink || ''} onChange={(e) => setPayment({ wiseLink: e.target.value })} />
              </Field>
              <Field label="Extra instructions">
                <textarea rows={2} className="field resize-none" placeholder="Reference, currency, etc." value={inv.payment?.details || ''} onChange={(e) => setPayment({ details: e.target.value })} />
              </Field>
            </div>
          </Section>

        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="card p-3 md:p-4">
            <div className="flex items-center justify-between px-2 pb-3">
              <span className="text-[13px] font-bold">Live preview</span>
              <span className="text-[12px] text-[color:var(--muted)] font-semibold">A4</span>
            </div>
            <div ref={previewBox} className="w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white" style={{ height: 1123 * scale }}>
              <div style={{ width: 794, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <InvoicePaper inv={inv} />
              </div>
            </div>
          </div>
        </div>
      </div>


      <section id="saved" className="mt-16 scroll-mt-24">
        <h2 className="text-[24px] font-extrabold tracking-tight mb-4">
          Saved <span className="serif-i font-normal">invoices</span>
        </h2>
        {saved.length === 0 ? (
          <div className="card p-8 text-center text-[14px] text-[color:var(--muted)]">
            {user ? 'Nothing saved yet. Press Save to keep an invoice here.' : 'Sign in to save invoices and find them here later.'}
          </div>
        ) : (
          <div className="card divide-y divide-[color:var(--border)] overflow-hidden">
            {saved.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="font-bold text-[14px]">{s.number}</div>
                  <div className="text-[12.5px] text-[color:var(--muted)] truncate">{s.client.name || 'No client'}</div>
                </div>
                <div className="font-bold tabular-nums text-[14px]">{money(calcTotals(s).total, s.currency)}</div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="btn btn-ghost !py-1.5 !px-3.5" onClick={() => loadInvoice(s)}>Open</button>
                  <button className="btn btn-ghost !py-1.5 !px-3.5 hover:!text-red-500" onClick={() => deleteInvoice(s.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }} aria-hidden="true">
        <InvoicePaper inv={inv} innerRef={paperRef} />
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] glass rounded-full px-5 py-3 text-[13.5px] font-semibold fade-up" style={{ boxShadow: 'var(--shadow)' }}>
          {toast}
        </div>
      )}
    </main>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="card px-4 py-4 md:px-5">
      <div className="text-[11.5px] font-semibold text-[color:var(--muted)] mb-1">{label}</div>
      <div className={`text-[18px] md:text-[24px] font-extrabold tracking-tight tabular-nums truncate ${accent ? 'text-[color:var(--accent)]' : ''}`}>{value}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="card p-5">
      <h3 className="font-bold text-[15px] mb-4 tracking-tight">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  )
}
