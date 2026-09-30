import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Upload, CornerDownRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/slugify'
import { flattenCategoryTree, descendantIdsOf } from '../../lib/categoryTree'

const inputStyle = { border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }

function coverUrl(path) {
  return path ? supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl : null
}

function CategoryFormModal({ category, parentId, categories, onClose, onSaved }) {
  const isNew = !category
  const [form, setForm] = useState({
    name: category?.name ?? '',
    parent_id: category?.parent_id ?? parentId ?? '',
    description: category?.description ?? '',
    sort_order: category?.sort_order ?? 0,
    active: category?.active ?? true,
  })
  const [coverPath, setCoverPath] = useState(category?.cover_path ?? null)
  const [coverFile, setCoverFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Una categoría no puede colgar de sí misma ni de una de sus hijas.
  const blocked = category ? new Set(descendantIdsOf(categories, category.id)) : new Set()
  const parentOptions = flattenCategoryTree(categories).filter((c) => !blocked.has(c.id))
  const previewUrl = coverFile ? URL.createObjectURL(coverFile) : coverUrl(coverPath)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true)

    let finalCover = coverPath
    const oldCover = category?.cover_path ?? null
    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const path = `categorias/${slugify(form.name)}-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, coverFile, { contentType: coverFile.type })
      if (upErr) { setSaving(false); setError(upErr.message); return }
      finalCover = path
    }

    const payload = {
      name: form.name.trim(),
      parent_id: form.parent_id || null,
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
      cover_path: finalCover,
    }

    let err
    if (isNew) {
      // El slug (la dirección web) se arma con la ruta de madres para que
      // "Anillos" de Oro y de Plata no choquen, y no cambia al renombrar.
      const parent = categories.find((c) => c.id === payload.parent_id)
      const base = parent ? `${parent.slug}-${slugify(payload.name)}` : slugify(payload.name)
      const exists = categories.some((c) => c.slug === base)
      ;({ error: err } = await supabase.from('categories').insert({ ...payload, slug: exists ? `${base}-${Date.now().toString(36)}` : base }))
    } else {
      ;({ error: err } = await supabase.from('categories').update(payload).eq('id', category.id))
    }

    if (err) { setSaving(false); setError(err.message); return }
    if (oldCover && oldCover !== finalCover) {
      await supabase.storage.from('product-images').remove([oldCover])
    }
    setSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8,58,79,0.55)' }} onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}>
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
          <X size={20} />
        </button>
        <h3 className="font-serif font-light mb-6" style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
          {isNew ? 'Nueva categoría' : 'Editar categoría'}
        </h3>

        {error && (
          <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Nombre</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Dentro de</label>
            <select value={form.parent_id} onChange={(e) => update('parent_id', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle}>
              <option value="">— Categoría principal (aparece en la portada) —</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.path}{c.active ? '' : ' (inactiva)'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Descripción (opcional)</label>
            <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
            <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>Se muestra debajo del título en la página de la categoría.</p>
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Foto de portada</label>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 overflow-hidden" style={{ width: '72px', height: '90px', backgroundColor: 'var(--bg-sand)' }}>
                {previewUrl
                  ? <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-serif" style={{ color: 'var(--gold)', opacity: 0.3 }}>◆</div>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 font-elegant text-xs cursor-pointer transition-opacity hover:opacity-70" style={{ border: '1px dashed var(--border-gold)', color: 'var(--navy-dim)' }}>
                  <Upload size={13} /> {previewUrl ? 'Cambiar foto' : 'Subir foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) setCoverFile(e.target.files[0]); e.target.value = '' }} />
                </label>
                {previewUrl && (
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPath(null) }} className="self-start font-elegant text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--teal)' }}>
                    Quitar foto
                  </button>
                )}
              </div>
            </div>
            <p className="font-elegant text-[10px] mt-2" style={{ color: 'var(--navy-xdim)' }}>
              Formato vertical (4:5) queda mejor. Sin foto, se usa la del primer producto de la categoría.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Orden</label>
              <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
            </div>
            <label className="flex items-center gap-2 font-elegant text-sm pb-2.5" style={{ color: 'var(--navy-dim)' }}>
              <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
              Visible en el sitio
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
          >
            {saving ? 'Guardando...' : isNew ? 'Crear categoría' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // { category } para editar, { parentId } para crear

  async function load() {
    setLoading(true)
    const { data, error: err } = await supabase.from('categories').select('*')
    if (err) setError(err.message)
    else setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(cat) {
    if (categories.some((c) => c.parent_id === cat.id)) {
      setError(`"${cat.name}" tiene subcategorías: borralas o movelas primero.`)
      return
    }
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    const { error: err } = await supabase.from('categories').delete().eq('id', cat.id)
    if (err) {
      setError(`No se pudo eliminar "${cat.name}": tiene productos asignados (de algún admin). Movelos a otra categoría o desactivala.`)
      return
    }
    if (cat.cover_path) await supabase.storage.from('product-images').remove([cat.cover_path])
    setError('')
    load()
  }

  const rows = flattenCategoryTree(categories)

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Categorías</h1>
          <p className="font-elegant text-xs mt-1" style={{ color: 'var(--navy-xdim)' }}>
            Compartidas entre todos los admins. Las principales son las portadas de la página de inicio.
          </p>
        </div>
        <button
          onClick={() => setModal({ parentId: null })}
          className="flex items-center gap-2 px-5 py-2.5 font-elegant transition-opacity hover:opacity-85"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
        >
          <Plus size={14} /> Categoría principal
        </button>
      </div>

      {error && (
        <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>{error}</p>
      )}

      {loading ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      ) : (
        <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          {rows.map((cat) => {
            const cover = coverUrl(cat.cover_path)
            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 pr-3 py-2.5"
                style={{
                  borderBottom: '1px solid var(--border)',
                  paddingLeft: `${16 + cat.depth * 28}px`,
                  backgroundColor: cat.depth === 0 ? 'var(--bg)' : 'transparent',
                  opacity: cat.active ? 1 : 0.5,
                }}
              >
                {cat.depth > 0 && <CornerDownRight size={13} style={{ color: 'var(--border-gold)', flexShrink: 0 }} />}
                <div className="flex-shrink-0 overflow-hidden" style={{ width: cat.depth === 0 ? '40px' : '30px', height: cat.depth === 0 ? '50px' : '38px', backgroundColor: 'var(--bg-sand)' }}>
                  {cover
                    ? <img src={cover} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center font-serif text-xs" style={{ color: 'var(--gold)', opacity: 0.3 }}>◆</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`truncate ${cat.depth === 0 ? 'font-serif text-base' : 'font-elegant text-sm'}`} style={{ color: 'var(--navy)' }}>
                    {cat.name}
                    {!cat.active && <span className="font-elegant text-[10px] uppercase ml-2" style={{ color: 'var(--navy-xdim)' }}>· oculta</span>}
                  </p>
                  <p className="font-elegant text-[10px] truncate" style={{ color: 'var(--navy-xdim)' }}>/categoria/{cat.slug}</p>
                </div>
                <button
                  onClick={() => setModal({ parentId: cat.id })}
                  className="flex items-center gap-1 px-2 py-1 font-elegant text-[10px] uppercase transition-opacity hover:opacity-70"
                  style={{ letterSpacing: '0.1em', color: 'var(--navy-dim)', border: '1px solid var(--border)' }}
                  title={`Agregar subcategoría en ${cat.name}`}
                >
                  <Plus size={11} /> Sub
                </button>
                <button onClick={() => setModal({ category: cat })} aria-label={`Editar ${cat.name}`} className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--gold)' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(cat)} aria-label={`Eliminar ${cat.name}`} className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--teal)' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <CategoryFormModal
          category={modal.category}
          parentId={modal.parentId}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
