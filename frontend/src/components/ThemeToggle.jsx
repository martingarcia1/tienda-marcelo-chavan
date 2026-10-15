import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export default function ThemeToggle({ withLabel = false, className = '' }) {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const isDark = theme === 'dark'
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-2 p-2 transition-opacity hover:opacity-70 ${className}`}
      style={{ color: 'var(--ivory)' }}
    >
      {isDark ? <Sun size={17} strokeWidth={1.4} /> : <Moon size={17} strokeWidth={1.4} />}
      {withLabel && (
        <span className="font-sans" style={{ fontSize: '0.72rem' }}>{isDark ? 'Tema claro' : 'Tema oscuro'}</span>
      )}
    </button>
  )
}
