import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'
import type { Exhibition } from '../types'
import { formatDateRange } from '../utils/format'

interface ExhibitionCardProps {
  exhibition: Exhibition
}

/** Event-style poster card for an exhibition. */
export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group overflow-hidden bg-ink text-ivory"
    >
      <Link to={`/expositions/${exhibition.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={exhibition.posterUrl}
            alt={exhibition.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {exhibition.current && (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              En cours
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl transition-colors group-hover:text-gold">
            {exhibition.title}
          </h3>
          <p className="mt-3 flex items-center gap-2 text-xs text-ivory/60">
            <CalendarDays size={13} className="text-gold" />
            {formatDateRange(exhibition.startDate, exhibition.endDate)}
          </p>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-ivory/60">
            <MapPin size={13} className="text-gold" />
            {exhibition.galleryName} · {exhibition.location}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
