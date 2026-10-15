import Breadcrumbs from './Breadcrumbs'

// Encabezado + contenedor común de las páginas del catálogo.
export default function CatalogPageShell({ breadcrumbs, eyebrow, title, description, actions, children }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-alt)', minHeight: '70vh' }}>
      <div style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-10">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {eyebrow && (
            <p className="font-elegant mt-8" style={{ fontSize: '0.6rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className="font-serif font-light mt-2" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--navy)', letterSpacing: '0.04em' }}>
              {title}
            </h1>
          )}
          {description && (
            <p className="font-elegant mt-3 max-w-2xl" style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--navy-dim)' }}>
              {description}
            </p>
          )}
          {actions && <div className="mt-5">{actions}</div>}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-28">{children}</div>
    </div>
  )
}

export function CatalogMessage({ children }) {
  return (
    <p className="text-xs font-elegant py-16 text-center" style={{ color: 'var(--navy-dim)' }}>{children}</p>
  )
}
