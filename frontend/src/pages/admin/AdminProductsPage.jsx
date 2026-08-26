import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminProductFormModal from './AdminProductFormModal'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function getImageUrl(storagePath) {
  if (!storagePath) return null
  return supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null = cerrado, {} = nuevo, {...} = editar
  const [creatingNew, setCreatingNew] = useState(false)

  async function load() {
    setLoading(true)
    const [{ data: prods, error: prodErr }, { data: cats, error: catErr }] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, slug, price, stock, active, category_id, category:categories(name), product_images(storage_path, sort_order)')
        .order('name'),
      supabase.from('categories').select('*').order('sort_order'),
    ])
    if (prodErr || catErr) setError(prodErr?.message || catErr?.message)
    else {
      setProducts(prods)
      setCategories(cats)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return
    const images = product.product_images || []
    if (images.length > 0) {
      await supabase.storage.from('product-images').remove(images.map((i) => i.storage_path))
    }
    const { error: err } = await supabase.from('products').delete().eq('id', product.id)
    if (err) {
      setError(err.message)
      return
    }
    load()
  }

  function handleModalClose() {
    setEditing(null)
    setCreatingNew(false)
  }

  function handleSaved() {
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>
          Productos
        </h1>
        <button
          onClick={() => setCreatingNew(true)}
          className="flex items-center gap-2 px-5 py-2.5 font-elegant transition-opacity hover:opacity-85"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
        >
          <Plus size={14} /> Nuevo producto
        </button>
      </div>

      {error && (
        <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      ) : (
        <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          {products.map((p) => {
            const images = [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)
            const img = getImageUrl(images[0]?.storage_path)
            return (
              <div key={p.id} className="flex items-center gap-4 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-sand)' }}>
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif" style={{ color: 'var(--gold)', opacity: 0.3 }}>◆</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm truncate" style={{ color: 'var(--navy)' }}>{p.name}</p>
                  <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>{p.category?.name}</p>
                </div>

                <p className="font-elegant text-sm w-24 text-right" style={{ color: 'var(--navy)' }}>
                  {p.price > 0 ? currency.format(p.price) : '—'}
                </p>
                <p className="font-elegant text-xs w-16 text-center" style={{ color: 'var(--navy-dim)' }}>
                  Stock: {p.stock}
                </p>
                <span
                  className="font-elegant text-[10px] px-2 py-1 uppercase w-20 text-center"
                  style={{
                    color: p.active ? 'var(--gold)' : 'var(--navy-xdim)',
                    border: `1px solid ${p.active ? 'var(--border-gold)' : 'var(--border)'}`,
                  }}
                >
                  {p.active ? 'Activo' : 'Oculto'}
                </span>

                <button onClick={() => setEditing(p)} aria-label="Editar" className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--gold)' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(p)} aria-label="Eliminar" className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--teal)' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {(editing || creatingNew) && (
        <AdminProductFormModal
          product={editing}
          categories={categories}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
