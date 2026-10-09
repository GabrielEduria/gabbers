export const CURRENCIES = {
  PHP: { symbol: '₱', locale: 'en-PH', label: 'PHP — Philippine peso' },
  USD: { symbol: '$', locale: 'en-US', label: 'USD — US dollar' },
  EUR: { symbol: '€', locale: 'de-DE', label: 'EUR — Euro' },
  GBP: { symbol: '£', locale: 'en-GB', label: 'GBP — British pound' },
}

export function money(n, currency = 'PHP') {
  const c = CURRENCIES[currency] || CURRENCIES.PHP
  const v = Number.isFinite(n) ? n : 0
  return c.symbol + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function calcTotals(inv) {
  const subtotal = inv.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0)
  const discount = Math.min(subtotal, Number(inv.discount) || 0)
  const taxable = subtotal - discount
  const tax = taxable * ((Number(inv.taxRate) || 0) / 100)
  return { subtotal, discount, tax, total: taxable + tax }
}

function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T00:00:00')
  if (isNaN(dt)) return '—'
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const lines = (s) => (s || '').split('\n').filter(Boolean)

export default function InvoicePaper({ inv, innerRef }) {
  const t = calcTotals(inv)
  const cur = inv.currency
  return (
    <div
      ref={innerRef}
      className="paper"
      style={{ width: 794, minHeight: 1123, padding: '64px 60px', boxSizing: 'border-box', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: 'italic', fontSize: 52, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Invoice
          </div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>{inv.number || '—'}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 13, lineHeight: 1.55, color: '#6e6e73' }}>
          <div style={{ fontWeight: 800, color: '#1d1d1f', fontSize: 15 }}>{inv.from.name || 'Your business'}</div>
          {inv.from.email && <div>{inv.from.email}</div>}
          {lines(inv.from.address).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 24, marginTop: 52, fontSize: 13 }}>
        <div>
          <Label>Billed to</Label>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{inv.client.name || 'Client name'}</div>
          <div style={{ color: '#6e6e73', lineHeight: 1.55 }}>
            {inv.client.email && <div>{inv.client.email}</div>}
            {lines(inv.client.address).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
        <div>
          <Label>Issued</Label>
          <div style={{ fontWeight: 700 }}>{fmtDate(inv.issueDate)}</div>
        </div>
        <div>
          <Label>Due</Label>
          <div style={{ fontWeight: 700 }}>{fmtDate(inv.dueDate)}</div>
        </div>
      </div>

      <table style={{ width: '100%', marginTop: 48, borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#6e6e73', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <th style={{ padding: '0 0 10px', fontWeight: 700 }}>Description</th>
            <th style={{ padding: '0 0 10px', fontWeight: 700, textAlign: 'right', width: 60 }}>Qty</th>
            <th style={{ padding: '0 0 10px', fontWeight: 700, textAlign: 'right', width: 120 }}>Price</th>
            <th style={{ padding: '0 0 10px', fontWeight: 700, textAlign: 'right', width: 130 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {inv.items.map((i) => {
            const amt = (Number(i.qty) || 0) * (Number(i.price) || 0)
            return (
              <tr key={i.id} style={{ borderTop: '1px solid #ececf0' }}>
                <td style={{ padding: '14px 12px 14px 0', fontWeight: 600 }}>{i.desc || <span style={{ color: '#b4b4ba' }}>Item description</span>}</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Number(i.qty) || 0}</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{money(Number(i.price) || 0, cur)}</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(amt, cur)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
        <div style={{ width: 300, fontSize: 13 }}>
          <Row label="Subtotal" value={money(t.subtotal, cur)} />
          {t.discount > 0 && <Row label="Discount" value={'−' + money(t.discount, cur)} />}
          <Row label={`Tax (${Number(inv.taxRate) || 0}%)`} value={money(t.tax, cur)} />
          <div style={{ borderTop: '1px solid #1d1d1f', marginTop: 10, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 700 }}>Total due</span>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#7c3aed', fontVariantNumeric: 'tabular-nums' }}>
              {money(t.total, cur)}
            </span>
          </div>
        </div>
      </div>

      {(inv.payment?.wiseEmail || inv.payment?.wiseLink || inv.payment?.details) && (
        <div style={{ marginTop: 40, padding: '18px 20px', borderRadius: 14, background: '#f6f3ff', border: '1px solid #e4dbff', fontSize: 12.5, lineHeight: 1.6 }}>
          <Label>Pay with Wise</Label>
          {inv.payment.wiseEmail && <div><b>Wise email:</b> {inv.payment.wiseEmail}</div>}
          {inv.payment.wiseLink && <div><b>Payment link:</b> {inv.payment.wiseLink}</div>}
          {inv.payment.details && <div style={{ color: '#4a4a4f', whiteSpace: 'pre-wrap', marginTop: 4 }}>{inv.payment.details}</div>}
        </div>
      )}
      
      {inv.notes && (
        <div style={{ marginTop: 56, fontSize: 12.5, lineHeight: 1.6 }}>
          <Label>Notes</Label>
          <div style={{ color: '#4a4a4f', whiteSpace: 'pre-wrap' }}>{inv.notes}</div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          bottom: 40,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#a1a1a6',
          fontWeight: 600,
          borderTop: '1px solid #ececf0',
          paddingTop: 14,
        }}
      >
        <span>Made with Gabbers</span>
        <span>Built by Gabriel Eduria</span>
      </div>
    </div>
  )
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1a6', fontWeight: 700, marginBottom: 6 }}>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#6e6e73' }}>
      <span>{label}</span>
      <span style={{ color: '#1d1d1f', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}
