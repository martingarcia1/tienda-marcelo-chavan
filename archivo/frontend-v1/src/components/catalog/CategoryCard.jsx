import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CategoryCard({ to, name, cover, subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: delay * 0.07, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={to} className="group block relative overflow-hidden" style={{ aspectRatio: '4/5', backgroundColor: 'var(--bg-sand)' }}>
        {cover ? (
          <img
            src={cover}
            alt={name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif select-none" style={{ fontSize: '4rem', color: 'var(--gold)', opacity: 0.15 }}>◆</span>
          </div>
        )}

        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(8,32,44,0.78) 0%, rgba(8,32,44,0.15) 45%, transparent 70%)' }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p className="font-serif font-light leading-tight" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)', color: '#FAFAF8', letterSpacing: '0.04em' }}>
            {name}
          </p>
          {subtitle && (
            <p className="font-elegant mt-1.5" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.75)' }}>
              {subtitle}
            </p>
          )}
          <div className="h-px mt-3 transition-all duration-500 w-6 group-hover:w-14" style={{ backgroundColor: 'var(--gold)' }} />
        </div>
      </Link>
    </motion.div>
  )
}
