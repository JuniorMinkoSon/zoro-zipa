import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import type { Gallery } from '../types'

interface GalleryCardProps {
  gallery: Gallery
}

/** Partner gallery card. */
export function GalleryCard({ gallery }: GalleryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group overflow-hidden border border-ink/10 bg-white"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={gallery.imageUrl}
          alt={gallery.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg">{gallery.name}</h3>
          {gallery.partner && (
            <span className="shrink-0 rounded-full border border-gold px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-gold">
              Partenaire
            </span>
          )}
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/50">
          <MapPin size={12} className="text-gold" /> {gallery.city}
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-ink/70">{gallery.description}</p>
      </div>
    </motion.article>
  )
}
