import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import logo from '../../assets/logo.jpg'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/admin', { replace: true })
  }, [loading, user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInError) {
      setError('Email o contraseña incorrectos.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg-alt)' }}>
      <div className="w-full max-w-sm">
        <img src={logo} alt="Marcelo Chavan" className="mx-auto mb-8" style={{ height: '56px', width: 'auto' }} />

        <form
          onSubmit={handleSubmit}
          className="p-8"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(8,58,79,0.1)' }}
        >
          <p
            className="font-elegant mb-6 text-center"
            style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}
          >
            Panel de administración
          </p>

          <label className="block font-elegant mb-1.5" style={{ fontSize: '0.65rem', color: 'var(--navy-dim)' }}>Email</label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 mb-4 font-elegant text-sm"
            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
          />

          <label className="block font-elegant mb-1.5" style={{ fontSize: '0.65rem', color: 'var(--navy-dim)' }}>Contraseña</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 mb-5 font-elegant text-sm"
            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
          />

          {error && (
            <p className="font-elegant text-xs mb-4" style={{ color: 'var(--teal)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
