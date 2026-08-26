import { useState, useEffect } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/slugify'

function getImageUrl(storagePath) {
  return supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl
}

const BLANK = { name: '', category_id: '', price: 0, stock: 0, tag: '', description: '', active: true }

export default function AdminProductFormModal({ product, categories, onClose, onSaved }) {
  const [localProduct, setLocalProduct] = useState(product)
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          category_id: product.category_id,
          price: product.price,
          stock: product.stock,
          tag: product.tag || '',
          description: product.description || '',
          active: product.active,
        }
      : BLANK
  )
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function loadImages(productId) {
    const { data } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order')
    setImages(data || [])
  }

  useEffect(() => {
    if (localProduct?.id) loadImages(localProduct.id)
  }, [localProduct?.id])

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.category_id) {
      setError('Nombre y categoría son obligatorios.')
      return
    }
    setSaving(true)

    if (localProduct?.id) {
      const { error: err } = await supabase
        .from('products')
        .update({
          name: form.name.trim(),
          category_id: form.category_id,
          price: Number(form.price) || 0,
          stock: Number(form.stock) || 0,
          tag: form.tag.trim() || null,
          description: form.description.trim() || null,
          active: form.active,
        })
        .eq('id', localProduct.id)
      setSaving(false)
      if (err) { setError(err.message); return }
      onSaved()
    } else {
      const { data, error: err } = await supabase
        .from('products')
        .insert({
          name: form.name.trim(),
          slug: slugify(form.name) + '-' + Date.now().toString(36),
          category_id: form.category_id,
          price: Number(form.price) || 0,
          stock: Number(form.stock) || 0,
          tag: form.tag.trim() || null,
          description: form.description.trim() || null,
          active: form.active,
        })
        .select()
        .single()
      setSaving(false)
      if (err) { setError(err.message); return }
      setLocalProduct(data)
      onSaved()
    }
  }

  async function handleUploadImage(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file || !localProduct?.id) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${localProduct.slug}-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type })
    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }
    const { error: insErr } = await supabase
      .from('product_images')
      .insert({ product_id: localProduct.id, storage_path: path, sort_order: images.length })
    setUploading(false)
    if (insErr) { setError(insErr.message); return }
    loadImages(localProduct.id)
  }

  async function handleDeleteImage(img) {
    await supabase.storage.from('product-images').remove([img.storage_path])
    await supabase.from('product_images').delete().eq('id', img.id)
    loadImages(localProduct.id)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8,58,79,0.55)' }} onClick={onClose} />

      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-8"
        style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}
      >
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
          <X size={20} />
        </button>

        <h3 className="font-serif font-light mb-6" style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
          {localProduct?.id ? 'Editar producto' : 'Nuevo producto'}
        </h3>

        {error && (
          <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2.5 font-elegant text-sm"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
            />
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Categoría</label>
            <select
              value={form.category_id}
              onChange={(e) => updateField('category_id', e.target.value)}
              className="w-full px-3 py-2.5 font-elegant text-sm"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
            >
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Precio ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                className="w-full px-3 py-2.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              />
            </div>
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                className="w-full px-3 py-2.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              />
            </div>
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Etiqueta (opcional)</label>
            <input
              type="text"
              placeholder="Ej: Nueva Colección, Promos"
              value={form.tag}
              onChange={(e) => updateField('tag', e.target.value)}
              className="w-full px-3 py-2.5 font-elegant text-sm"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
            />
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Descripción</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2.5 font-elegant text-sm"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
            />
          </div>

          <label className="flex items-center gap-2 font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => updateField('active', e.target.checked)} />
            Activo (visible en el sitio)
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
          >
            {saving ? 'Guardando...' : localProduct?.id ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </form>

        {/* Fotos */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <label className="block font-elegant mb-3 text-xs" style={{ color: 'var(--navy-dim)' }}>Fotos</label>

          {!localProduct?.id ? (
            <p className="font-elegant text-xs italic" style={{ color: 'var(--navy-xdim)' }}>
              Guardá el producto primero para poder subir fotos.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {images.map((img) => (
                  <div key={img.id} className="relative" style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-sand)' }}>
                    <img src={getImageUrl(img.storage_path)} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteImage(img)}
                      aria-label="Eliminar foto"
                      className="absolute top-1 right-1 p-1 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: 'rgba(8,58,79,0.7)', color: '#fff', borderRadius: '4px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <label
                className="flex items-center justify-center gap-2 py-3 font-elegant text-xs cursor-pointer transition-opacity hover:opacity-70"
                style={{ border: '1px dashed var(--border-gold)', color: 'var(--navy-dim)' }}
              >
                <Upload size={14} />
                {uploading ? 'Subiendo...' : 'Subir foto'}
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={uploading} />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
