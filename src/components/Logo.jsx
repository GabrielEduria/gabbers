export default function Logo({ size = 28 }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span
        className="inline-flex items-center justify-center rounded-[9px] text-white"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg,#a78bfa,#7c3aed 60%,#5b21b6)',
          boxShadow: '0 4px 14px -4px rgba(124,58,237,.6)',
        }}
      >
        <span className="serif-i" style={{ fontSize: size * 0.72, lineHeight: 1, marginTop: -2 }}>
          g
        </span>
      </span>
      <span className="font-bold tracking-tight text-[17px]">Gabbers</span>
    </span>
  )
}
