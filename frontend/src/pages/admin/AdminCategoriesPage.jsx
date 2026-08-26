import { useState, useEffect } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/slugify'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(null)

  async function load() {
    setLoading(true)
    const { data, error: err } = await supabase.from('categories').select('*').order('sort_order')
    if (err) setError(err.message)
    else setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function updateLocal(id, changes) {
    setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, ...changes, _dirty: true } : c)))
  }

  async function handleSave(cat) {
    setSaving(cat.id)
    const { error: err } = await supabase
      .from('categories')
      .update({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order, active: cat.active })
      .eq('id', cat.id)
    setSaving(null)
    if (err) {
      setError(err.message)
      return
    }
    setCategories((cs) => cs.map((c) => (c.id === cat.id ? { ...c, _dirty: false } : c)))
  }

  async function handleDelete(cat) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"? Solo se puede si no tiene productos.`)) return
    const { error: err } = await supabase.from('categories').delete().eq('id', cat.id)
    if (err) {
      setError('No se pudo eliminar: probablemente tiene productos asociados.')
      return
    }
    load()
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    const { error: err } = await supabase.from('categories').insert({
      name: newName.trim(),
      slug: slugify(newName),
      sort_order: categories.length,
      active: true,
    })
    if (err) {
      setError(err.message)
      return
    }
    setNewName('')
    load()
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif font-light mb-8" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>
        Categorías
      </h1>

      {error && (
        <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleCreate} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoría"
          className="flex-1 px-4 py-2.5 font-elegant text-sm"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--navy)' }}
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 font-elegant transition-opacity hover:opacity-85"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
        >
          <Plus size={14} /> Agregar
        </button>
      </form>

      {loading ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      ) : (
        <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateLocal(cat.id, { name: e.target.value })}
                className="flex-1 px-2 py-1.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              />
              <input
                type="number"
                value={cat.sort_order}
                onChange={(e) => updateLocal(cat.id, { sort_order: Number(e.target.value) })}
                className="w-16 px-2 py-1.5 font-elegant text-sm text-center"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
                title="Orden"
              />
              <label className="flex items-center gap-1.5 font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                <input
                  type="checkbox"
                  checked={cat.active}
                  onChange={(e) => updateLocal(cat.id, { active: e.target.checked })}
                />
                Activa
              </label>
              <button
                onClick={() => handleSave(cat)}
                disabled={!cat._dirty || saving === cat.id}
                aria-label="Guardar"
                className="p-2 transition-opacity hover:opacity-70 disabled:opacity-25"
                style={{ color: 'var(--gold)' }}
              >
                <Save size={15} />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                aria-label="Eliminar"
                className="p-2 transition-opacity hover:opacity-70"
                style={{ color: 'var(--teal)' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
