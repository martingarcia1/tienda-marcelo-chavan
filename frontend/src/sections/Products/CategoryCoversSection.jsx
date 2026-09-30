import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ruler, ArrowRight } from 'lucide-react'
import RingSizeGuide from '../../components/RingSizeGuide'
import CategoryCard from '../../components/catalog/CategoryCard'
import { useCatalog } from '../../hooks/useCatalog'
import { childrenOf, coverFor, productsInTree } from '../../lib/catalog'

export default function CategoryCoversSection() {
  const { catalog, loading, error } = useCatalog()
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const roots = catalog ? childrenOf(catalog.categories, null) : []
  const onSale = catalog ? catalog.products.filter((p) => p.onSale) : []

  return (
    <section id="productos">
      <motion.div
        className="text-center py-16"
        style={{ backgroundColor: 'var(--bg)' }}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75 }}
      >
        <p className="text-[9px] tracking-[0.5em] uppercase font-elegant mb-4" style={{ color: 'var(--gold)' }}>
          Colecciones
        </p>
        <h2 className="font-serif font-light" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'var(--navy)', letterSpacing: '0.06em' }}>
          Nuestros Productos
        </h2>
        <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: 'var(--gold)' }} />
        <p className="text-xs font-elegant mt-5 max-w-md mx-auto" style={{ color: 'var(--navy-dim)' }}>
          Elegí una colección para ver sus piezas
        </p>
        <button
          onClick={() => setSizeGuideOpen(true)}
          className="inline-flex items-center gap-1.5 mt-5 font-elegant transition-opacity hover:opacity-70"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy)' }}
        >
          <Ruler size={13} style={{ color: 'var(--gold)' }} />
          ¿No sabés tu talle? Guía de talles
        </button>
      </motion.div>

      <RingSizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <div className="py-4 pb-28" style={{ backgroundColor: 'var(--bg-alt)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {error && (
            <p className="text-xs font-elegant py-10 text-center" style={{ color: 'var(--navy-dim)' }}>
              No pudimos cargar el catálogo. Probá recargar la página.
            </p>
          )}
          {loading && (
            <p className="text-xs font-elegant py-10 text-center" style={{ color: 'var(--navy-dim)' }}>Cargando colecciones...</p>
          )}

          {catalog && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-8">
                {roots.map((c, i) => {
                  const count = productsInTree(catalog, c.id).length
                  return (
                    <CategoryCard
                      key={c.id}
                      to={`/categoria/${c.slug}`}
                      name={c.name}
                      cover={coverFor(catalog, c)}
                      subtitle={count > 0 ? `${count} ${count === 1 ? 'pieza' : 'piezas'}` : 'Próximamente'}
                      delay={i}
                    />
                  )
                })}
              </div>

              {onSale.length > 0 && (
                <Link
                  to="/ofertas"
                  className="group mt-6 flex items-center justify-between px-6 md:px-10 py-7 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--teal)', color: '#FAFAF8' }}
                >
                  <div>
                    <p className="font-elegant" style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.8 }}>
                      Promos y ofertas
                    </p>
                    <p className="font-serif font-light mt-1" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)' }}>
                      {onSale.length} {onSale.length === 1 ? 'pieza con descuento' : 'piezas con descuento'}
                    </p>
                  </div>
                  <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              <div className="text-center mt-12">
                <Link
                  to="/productos"
                  className="inline-flex items-center gap-2 px-8 py-3.5 font-elegant transition-opacity hover:opacity-80"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', border: '1px solid var(--border-gold)', color: 'var(--navy)' }}
                >
                  Ver todo el catálogo <ArrowRight size={13} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
