import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, Eye, EyeOff, Film, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useMyLocal } from '../../lib/myLocal'
import { BUCKET_PROMOS, MAX_MB_PROMO, promoUrl } from '../../lib/promociones'

const inputStyle = { border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }
const labelClass = 'block font-elegant mb-1.5 text-xs'

const TIPOS_ACEPTADOS = 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime'

// boton_url guardado → opción del selector + enlace libre.
function destinoDesde(url, local) {
  if (!url) return { destino: 'ninguno', enlace: '' }
  if (url === 'whatsapp') return { destino: 'whatsapp', enlace: '' }
  if (local && url === `/espacios/${local.slug}`) return { destino: 'vidriera', enlace: '' }
  return { destino: 'enlace', enlace: url }
}

function PromoFormModal({ promo, local, userId, siguienteOrden, onClose, onSaved }) {
  const inicial = destinoDesde(promo?.boton_url, local)
  const [form, setForm] = useState({
    titulo: promo?.titulo ?? '',
    boton_texto: promo?.boton_texto ?? '',
    destino: inicial.destino,
    enlace: inicial.enlace,
    activo: promo?.activo ?? true,
  })
  const [archivo, setArchivo] = useState(null)
  const [preview, setPreview] = useState(promo ? { url: promoUrl(promo.storage_path), tipo: promo.tipo } : null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  useEffect(() => () => { if (archivo && preview?.url.startsWith('blob:')) URL.revokeObjectURL(preview.url) }, [archivo, preview])

  function elegirArchivo(e) {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    setError('')
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) { setError('El archivo tiene que ser una imagen o un video.'); return }
    if (f.size > MAX_MB_PROMO * 1024 * 1024) {
      setError(`El archivo pesa ${(f.size / 1024 / 1024).toFixed(0)} MB. El máximo es ${MAX_MB_PROMO} MB: probá con un video más corto o comprimido.`)
      return
    }
    setArchivo(f)
    setPreview({ url: URL.createObjectURL(f), tipo: f.type.startsWith('video/') ? 'video' : 'imagen' })
  }

  function botonUrl() {
    if (form.destino === 'whatsapp') return 'whatsapp'
    if (form.destino === 'vidriera') return `/espacios/${local.slug}`
    if (form.destino === 'enlace') return form.enlace.trim() || null
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!promo && !archivo) { setError('Elegí una imagen o un video.'); return }
    if (form.destino !== 'ninguno' && !form.boton_texto.trim()) { setError('Escribí el texto del botón (ej: "Ver colección").'); return }
    if (form.destino === 'enlace' && !form.enlace.trim()) { setError('Pegá el enlace del botón.'); return }

    setSaving(true)
    let storage_path = promo?.storage_path
    let tipo = promo?.tipo
    if (archivo) {
      const ext = (archivo.name.split('.').pop() || 'bin').toLowerCase()
      storage_path = `${userId}/${Date.now()}.${ext}`
      tipo = archivo.type.startsWith('video/') ? 'video' : 'imagen'
      const { error: upErr } = await supabase.storage.from(BUCKET_PROMOS).upload(storage_path, archivo, { contentType: archivo.type })
      if (upErr) { setSaving(false); setError(upErr.message); return }
    }

    const payload = {
      local_slug: local.slug,
      tipo,
      storage_path,
      titulo: form.titulo.trim() || null,
      boton_texto: form.destino === 'ninguno' ? null : form.boton_texto.trim(),
      boton_url: botonUrl(),
      activo: form.activo,
    }
    const { error: err } = promo
      ? await supabase.from('promociones').update(payload).eq('id', promo.id)
      : await supabase.from('promociones').insert({ ...payload, sort_order: siguienteOrden })
    if (err) {
      if (archivo) await supabase.storage.from(BUCKET_PROMOS).remove([storage_path])
      setSaving(false); setError(err.message); return
    }
    // Si se reemplazó el archivo, se borra el anterior.
    if (promo && archivo) await supabase.storage.from(BUCKET_PROMOS).remove([promo.storage_path])
    setSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--overlay)' }} onClick={saving ? undefined : onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px var(--shadow)' }}>
        <button onClick={onClose} disabled={saving} aria-label="Cerrar" className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
          <X size={20} />
        </button>
        <h3 className="font-serif font-light mb-6" style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
          {promo ? 'Editar publicidad' : 'Nueva publicidad'}
        </h3>

        {error && (
          <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(143,191,180,0.1)' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className={labelClass} style={{ color: 'var(--navy-dim)' }}>Imagen o video</span>
            {preview && (
              <div className="relative mb-3 overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: 'var(--bg-sand)' }}>
                {preview.tipo === 'video'
                  ? <video src={preview.url} className="w-full h-full object-contain" autoPlay muted loop playsInline />
                  : <img src={preview.url} alt="" className="w-full h-full object-contain" />}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 py-3 font-elegant text-xs cursor-pointer transition-opacity hover:opacity-70" style={{ border: '1px dashed var(--border-gold)', color: 'var(--navy-dim)' }}>
              <ImageIcon size={14} /> <Film size={14} />
              {preview ? 'Cambiar archivo' : 'Elegir imagen o video'}
              <input type="file" accept={TIPOS_ACEPTADOS} className="hidden" onChange={elegirArchivo} disabled={saving} />
            </label>
            <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>
              JPG, PNG o WEBP; videos MP4 o MOV de hasta {MAX_MB_PROMO} MB. Los videos se ven sin sonido y en loop.
            </p>
          </div>

          <div>
            <label className={labelClass} style={{ color: 'var(--navy-dim)' }}>Título (opcional)</label>
            <input type="text" value={form.titulo} onChange={(e) => update('titulo', e.target.value)} maxLength={90} placeholder="Ej: Nueva colección Navidad" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
          </div>

          <div>
            <label className={labelClass} style={{ color: 'var(--navy-dim)' }}>Botón</label>
            <select value={form.destino} onChange={(e) => update('destino', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle}>
              <option value="ninguno">Sin botón</option>
              <option value="vidriera">Ir a la vidriera de {local.nombre}</option>
              <option value="whatsapp">Consultar por WhatsApp</option>
              <option value="enlace">Otro enlace (Instagram, una pieza, etc.)</option>
            </select>
          </div>

          {form.destino !== 'ninguno' && (
            <div className={form.destino === 'enlace' ? 'grid sm:grid-cols-2 gap-4' : ''}>
              <div>
                <label className={labelClass} style={{ color: 'var(--navy-dim)' }}>Texto del botón</label>
                <input type="text" value={form.boton_texto} onChange={(e) => update('boton_texto', e.target.value)} maxLength={30} placeholder="Ej: Ver colección" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
              </div>
              {form.destino === 'enlace' && (
                <div>
                  <label className={labelClass} style={{ color: 'var(--navy-dim)' }}>Enlace</label>
                  <input type="text" value={form.enlace} onChange={(e) => update('enlace', e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>
            <input type="checkbox" checked={form.activo} onChange={(e) => update('activo', e.target.checked)} />
            Visible en el sitio
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: 'var(--on-copper)' }}
          >
            {saving ? (archivo ? 'Subiendo...' : 'Guardando...') : promo ? 'Guardar cambios' : 'Publicar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPromocionesPage() {
  const userId = useAuthStore((s) => s.user?.id)
  const { local, loading: loadingLocal } = useMyLocal()
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('promociones')
      .select('*')
      .eq('created_by', userId)
      .order('sort_order')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setPromos(data)
    setLoading(false)
  }

  useEffect(() => { if (userId) load() }, [userId])

  async function toggleActivo(p) {
    const { error: err } = await supabase.from('promociones').update({ activo: !p.activo }).eq('id', p.id)
    if (err) { setError(err.message); return }
    load()
  }

  // Intercambia el orden con la vecina (arriba = se muestra antes).
  async function mover(i, delta) {
    const a = promos[i], b = promos[i + delta]
    if (!a || !b) return
    const ordenA = a.sort_order === b.sort_order ? b.sort_order + delta : b.sort_order
    const res = await Promise.all([
      supabase.from('promociones').update({ sort_order: ordenA }).eq('id', a.id),
      supabase.from('promociones').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    const err = res.find((r) => r.error)?.error
    if (err) setError(err.message)
    load()
  }

  async function handleDelete(p) {
    if (!confirm(`¿Eliminar ${p.titulo ? `"${p.titulo}"` : 'esta publicidad'}? Se borra también el archivo.`)) return
    const { error: err } = await supabase.from('promociones').delete().eq('id', p.id)
    if (err) { setError(err.message); return }
    await supabase.storage.from(BUCKET_PROMOS).remove([p.storage_path])
    load()
  }

  const siguienteOrden = promos.length ? Math.min(...promos.map((p) => p.sort_order)) - 1 : 0

  if (!loadingLocal && !local) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Publicidad</h1>
        <p className="font-elegant text-sm mt-4" style={{ color: 'var(--navy-dim)' }}>Esta cuenta no está a cargo de ningún local, así que no puede publicar.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Publicidad</h1>
          <p className="font-elegant text-xs mt-1 max-w-xl" style={{ color: 'var(--navy-xdim)' }}>
            Imágenes y videos que se muestran en el carrusel del inicio y en la página de Novedades, junto con los de los otros locales. Acá ves solo las de {local?.nombre || 'tu local'}.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          disabled={!local}
          className="flex items-center gap-2 px-5 py-2.5 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: 'var(--on-copper)' }}
        >
          <Plus size={14} /> Nueva publicidad
        </button>
      </div>

      {error && (
        <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(143,191,180,0.1)' }}>{error}</p>
      )}

      {loading ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      ) : promos.length === 0 ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Todavía no publicaste nada. Subí tu primera imagen o video con "Nueva publicidad".</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {promos.map((p, i) => (
            <div key={p.id} style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', opacity: p.activo ? 1 : 0.6 }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', backgroundColor: 'var(--bg-sand)' }}>
                {p.tipo === 'video'
                  ? <video src={promoUrl(p.storage_path)} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                  : <img src={promoUrl(p.storage_path)} alt="" className="w-full h-full object-cover" />}
                <span className="absolute top-2 left-2 flex items-center gap-1 font-elegant text-[10px] px-2 py-1 uppercase" style={{ backgroundColor: 'rgba(12,10,8,0.7)', color: '#efe6da' }}>
                  {p.tipo === 'video' ? <Film size={11} /> : <ImageIcon size={11} />} {p.tipo}
                </span>
                {!p.activo && (
                  <span className="absolute top-2 right-2 font-elegant text-[10px] px-2 py-1 uppercase" style={{ backgroundColor: 'rgba(12,10,8,0.7)', color: '#efe6da' }}>Oculta</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-elegant text-sm truncate" style={{ color: 'var(--navy)' }}>{p.titulo || 'Sin título'}</p>
                <p className="font-elegant text-xs truncate mt-0.5" style={{ color: 'var(--navy-xdim)' }}>
                  {p.boton_texto ? `Botón: ${p.boton_texto}` : 'Sin botón'}
                </p>
                <div className="flex items-center gap-1 mt-3 -ml-2">
                  <button onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Mostrar antes" className="p-2 transition-opacity hover:opacity-70 disabled:opacity-25" style={{ color: 'var(--navy-dim)' }}><ArrowUp size={15} /></button>
                  <button onClick={() => mover(i, 1)} disabled={i === promos.length - 1} aria-label="Mostrar después" className="p-2 transition-opacity hover:opacity-70 disabled:opacity-25" style={{ color: 'var(--navy-dim)' }}><ArrowDown size={15} /></button>
                  <button onClick={() => toggleActivo(p)} aria-label={p.activo ? 'Ocultar' : 'Mostrar'} title={p.activo ? 'Ocultar del sitio' : 'Mostrar en el sitio'} className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--navy-dim)' }}>
                    {p.activo ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <span className="flex-1" />
                  <button onClick={() => setEditing(p)} aria-label="Editar" className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--gold)' }}><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(p)} aria-label="Eliminar" className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--teal)' }}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && local && (
        <PromoFormModal
          promo={editing}
          local={local}
          userId={userId}
          siguienteOrden={siguienteOrden}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}
