// Monograma "MCH." del cartel del local, en tipografía cobriza.
export default function Monogram({ size = 1, shimmer = false }) {
  const cls = shimmer ? 'font-sign text-copper-shimmer' : 'font-sign'
  const color = shimmer ? undefined : 'var(--copper)'
  return (
    <span className="inline-flex items-end leading-none select-none" aria-label="Marcelo Chavan">
      <span className={cls} style={{ fontSize: `${2.1 * size}rem`, lineHeight: 0.9, color }}>M</span>
      <span className={cls} style={{ fontSize: `${0.95 * size}rem`, letterSpacing: '0.05em', marginBottom: '0.12em', marginLeft: '-0.06em', color }}>CH.</span>
    </span>
  )
}
