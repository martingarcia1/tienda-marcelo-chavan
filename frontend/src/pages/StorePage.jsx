import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productsApi } from '../services/api'

// ─── Categorías por material ───────────────────────────────────────────────────
const CATS_PLATA = [
  { slug: 'promos',              label: 'Promos' },
  { slug: 'nueva-coleccion',     label: 'Nueva Colección' },
  { slug: 'aros',                label: 'Aros' },
  { slug: 'pulseras',            label: 'Pulseras' },
  { slug: 'conjuntos',           label: 'Conjuntos' },
  { slug: 'anillos',             label: 'Anillos' },
  { slug: 'medallas-religiosas', label: 'Medallas Religiosas' },
]

const CATS_ACERO = [
  { slug: 'aros-acero',      label: 'Aros' },
  { slug: 'anillos-acero',   label: 'Anillos' },
  { slug: 'pulseras-acero',  label: 'Pulseras' },
  { slug: 'cadenas-acero',   label: 'Cadenas' },
]

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Más nuevos' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'featured',  label: 'Destacados' },
]

// ─── Productos mock para cuando el backend no tenga datos ──────────────────────
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Aros Argolla Lisa',    price: 4500, material: 'Plata 925',  categoria: 'aros',     badge: 'Nuevo',       gradient: 'from-sand to-aqua/60' },
  { _id: '2', name: 'Anillo Solitario',     price: 6800, material: 'Plata 925',  categoria: 'anillos',  badge: 'Destacado',   gradient: 'from-aqua to-teal/40' },
  { _id: '3', name: 'Pulsera Esclava',      price: 5200, material: 'Plata 925',  categoria: 'pulseras', badge: null,          gradient: 'from-sand-dark to-sand' },
  { _id: '4', name: 'Cadena Veneziana',     price: 8900, material: 'Plata 950',  categoria: 'aros',     badge: 'Nuevo',       gradient: 'from-aqua/50 to-aqua-dark' },
  { _id: '5', name: 'Aros Mariposa',        price: 3800, material: 'Plata 925',  categoria: 'aros',     badge: 'Más vendido', gradient: 'from-sand to-aqua/60' },
  { _id: '6', name: 'Anillo Corazón',       price: 5500, material: 'Plata 925',  categoria: 'anillos',  badge: null,          gradient: 'from-aqua to-teal/40' },
  { _id: '7', name: 'Pulsera Figaro',       price: 7200, material: 'Acero',      categoria: 'pulseras', badge: 'Más vendido', gradient: 'from-navy/20 to-teal/30' },
  { _id: '8', name: 'Aros Perla',           price: 4100, material: 'Plata 950',  categoria: 'aros',     badge: null,          gradient: 'from-sand-dark to-sand' },
  { _id: '9', name: 'Medalla San Expedito', price: 3200, material: 'Plata 925',  categoria: 'medallas', badge: 'Nuevo',       gradient: 'from-gold/20 to-sand' },
  { _id: '10', name: 'Conjunto Argolla',    price: 9800, material: 'Plata 925',  categoria: 'conjuntos', badge: 'Destacado',  gradient: 'from-teal/20 to-aqua' },
  { _id: '11', name: 'Cadena Acero 60cm',   price: 5600, material: 'Acero',      categoria: 'cadenas',  badge: null,          gradient: 'from-navy/15 to-teal/20' },
  { _id: '12', name: 'Anillo Acero Liso',   price: 2900, material: 'Acero',      categoria: 'anillos',  badge: 'Nuevo',       gradient: 'from-navy/10 to-aqua/30' },
]

// ─── Sub-componentes ───────────────────────────────────────────────────────────

function JewelryIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.3" />
      <path d="M40 18L40 14M40 66L40 62M18 40L14 40M66 40L62 40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
    </svg>
  )
}

function ProductCard({ product }) {
  const { _id, name, price, material, badge, gradient = 'from-sand to-aqua/50' } = product
  return (
    <Link to={`/producto/${_id}`} className="group block">
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${gradient} overflow-hidden mb-3`}>
        {product.image
          ? <img src={product.image} alt={name} className="w-full h-full object-cover" />
          : <JewelryIcon className="absolute inset-0 m-auto w-14 h-14 text-navy" />
        }
        {badge && (
          <span className="absolute top-3 left-3 bg-navy text-sand text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1">
            {badge}
          </span>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-navy text-sand text-xs font-medium tracking-widest uppercase text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          Ver producto
        </div>
      </div>
      <p className="text-[10px] text-teal tracking-[0.15em] uppercase mb-1">{material}</p>
      <p className="text-sm font-medium text-navy group-hover:text-gold transition-colors leading-tight">{name}</p>
      <p className="text-sm text-gold font-medium mt-1">${price.toLocaleString('es-AR')}</p>
    </Link>
  )
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? 'bg-navy border-navy' : 'border-sand-dark group-hover:border-navy'
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-sm text-navy/70 group-hover:text-navy transition-colors">{label}</span>
    </label>
  )
}

function Sidebar({ filters, onChange, onClear }) {
  const { material, categorias, precioMin, precioMax } = filters
  const cats = material === 'acero' ? CATS_ACERO : CATS_PLATA

  return (
    <aside className="w-full">
      {/* Header sidebar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-navy">Filtros</h2>
        {(material || categorias.length > 0) && (
          <button onClick={onClear} className="text-xs text-teal hover:text-navy transition-colors">
            Limpiar todo
          </button>
        )}
      </div>

      {/* Material */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold text-navy/40 tracking-[0.2em] uppercase mb-3">Material</p>
        <div className="flex flex-col gap-2.5">
          {[
            { value: '',       label: 'Todos' },
            { value: 'plata',  label: 'Plata 925' },
            { value: 'acero',  label: 'Acero quirúrgico' },
          ].map(({ value, label }) => (
            <FilterCheckbox
              key={value}
              label={label}
              checked={material === value}
              onChange={() => onChange('material', value)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-sand-dark mb-7" />

      {/* Categoría */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold text-navy/40 tracking-[0.2em] uppercase mb-3">Categoría</p>
        <div className="flex flex-col gap-2.5">
          {cats.map(({ slug, label }) => (
            <FilterCheckbox
              key={slug}
              label={label}
              checked={categorias.includes(slug)}
              onChange={() => onChange('categoria', slug)}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-sand-dark mb-7" />

      {/* Precio */}
      <div>
        <p className="text-[10px] font-semibold text-navy/40 tracking-[0.2em] uppercase mb-3">Precio</p>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            placeholder="Mín."
            value={precioMin}
            onChange={e => onChange('precioMin', e.target.value)}
            className="w-full border border-sand-dark px-3 py-2 text-sm text-navy outline-none focus:border-teal transition-colors bg-white placeholder:text-navy/30"
          />
          <span className="text-navy/30 text-sm flex-shrink-0">—</span>
          <input
            type="number"
            placeholder="Máx."
            value={precioMax}
            onChange={e => onChange('precioMax', e.target.value)}
            className="w-full border border-sand-dark px-3 py-2 text-sm text-navy outline-none focus:border-teal transition-colors bg-white placeholder:text-navy/30"
          />
        </div>
      </div>
    </aside>
  )
}

// ─── StorePage ────────────────────────────────────────────────────────────────

export default function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({
    material:   searchParams.get('material') || '',
    categorias: searchParams.get('categoria') ? [searchParams.get('categoria')] : [],
    precioMin:  '',
    precioMax:  '',
  })

  // Sincronizar filtros → URL
  useEffect(() => {
    const params = {}
    if (filters.material) params.material = filters.material
    if (filters.categorias.length === 1) params.categoria = filters.categorias[0]
    setSearchParams(params, { replace: true })
  }, [filters])

  // Cargar productos
  useEffect(() => {
    setLoading(true)
    productsApi
      .getAll({
        material:  filters.material || undefined,
        categoria: filters.categorias[0] || undefined,
        precioMin: filters.precioMin || undefined,
        precioMax: filters.precioMax || undefined,
        sort,
      })
      .then(res => setProducts(res.data?.products || res.data || []))
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false))
  }, [filters, sort])

  const handleFilter = useCallback((key, value) => {
    setFilters(prev => {
      if (key === 'material') return { ...prev, material: value, categorias: [] }
      if (key === 'categoria') {
        const cats = prev.categorias.includes(value)
          ? prev.categorias.filter(c => c !== value)
          : [...prev.categorias, value]
        return { ...prev, categorias: cats }
      }
      return { ...prev, [key]: value }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ material: '', categorias: [], precioMin: '', precioMax: '' })
  }, [])

  // Título de página según filtros
  const pageTitle = filters.material
    ? `${filters.material === 'plata' ? 'Plata 925' : 'Acero Quirúrgico'}`
    : 'Toda la Tienda'

  // Chips de filtros activos
  const activeChips = [
    ...(filters.material ? [{ key: 'material', label: filters.material === 'plata' ? 'Plata 925' : 'Acero' }] : []),
    ...filters.categorias.map(c => {
      const found = [...CATS_PLATA, ...CATS_ACERO].find(x => x.slug === c)
      return { key: `cat-${c}`, label: found?.label || c }
    }),
    ...(filters.precioMin ? [{ key: 'precioMin', label: `Desde $${filters.precioMin}` }] : []),
    ...(filters.precioMax ? [{ key: 'precioMax', label: `Hasta $${filters.precioMax}` }] : []),
  ]

  const displayProducts = loading ? [] : products

  return (
    <div className="bg-white min-h-screen">

      {/* ── Breadcrumb + Header ──────────────────────────────── */}
      <div className="border-b border-sand-dark bg-sand">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-xs text-navy/40 mb-1">
            <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
            <span className="mx-2">·</span>
            <span>Tienda</span>
            {filters.material && (
              <>
                <span className="mx-2">·</span>
                <span>{filters.material === 'plata' ? 'Plata' : 'Acero'}</span>
              </>
            )}
          </p>
          <h1 className="font-display text-3xl font-semibold text-navy">{pageTitle}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-10">

          {/* ── Sidebar desktop ─────────────────────────────── */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar filters={filters} onChange={handleFilter} onClear={clearFilters} />
            </div>
          </div>

          {/* ── Contenido principal ─────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Botón filtros mobile */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-sand-dark px-4 py-2 text-sm text-navy hover:border-navy transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Filtros
                  {activeChips.length > 0 && (
                    <span className="bg-navy text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {activeChips.length}
                    </span>
                  )}
                </button>

                {/* Chips activos */}
                {activeChips.map(({ key, label }) => (
                  <span
                    key={key}
                    className="flex items-center gap-1.5 bg-sand text-navy text-xs px-3 py-1.5 border border-sand-dark"
                  >
                    {label}
                    <button
                      onClick={() => {
                        if (key === 'material') handleFilter('material', '')
                        else if (key.startsWith('cat-')) handleFilter('categoria', key.replace('cat-', ''))
                        else if (key === 'precioMin') handleFilter('precioMin', '')
                        else if (key === 'precioMax') handleFilter('precioMax', '')
                      }}
                      className="text-navy/40 hover:text-navy transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {!loading && (
                  <span className="text-xs text-navy/40 hidden md:block">
                    {displayProducts.length} resultado{displayProducts.length !== 1 ? 's' : ''}
                  </span>
                )}
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="border border-sand-dark px-3 py-2 text-sm text-navy bg-white outline-none focus:border-teal transition-colors"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-sand mb-3" />
                    <div className="h-2.5 bg-sand rounded w-1/3 mb-2" />
                    <div className="h-3 bg-sand rounded w-3/4 mb-1.5" />
                    <div className="h-3 bg-sand rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="py-20 text-center">
                <JewelryIcon className="w-16 h-16 text-navy/20 mx-auto mb-4" />
                <p className="font-display text-xl text-navy/40">No hay productos con esos filtros</p>
                <button onClick={clearFilters} className="mt-4 text-sm text-teal hover:text-navy transition-colors">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sidebar mobile (drawer) ──────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg text-navy font-semibold">Filtros</span>
              <button onClick={() => setSidebarOpen(false)} className="text-navy/40 hover:text-navy">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <Sidebar filters={filters} onChange={handleFilter} onClear={clearFilters} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-full mt-6 bg-navy text-sand py-3 text-sm font-medium tracking-widest uppercase"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
