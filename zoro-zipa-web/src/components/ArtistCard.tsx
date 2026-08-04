import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Artist } from '../types'

interface ArtistCardProps {
  artist: Artist
}

/** Portrait card linking to the artist's magazine-style profile. */
export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/artistes/${artist.id}`} className="group block text-center">
        <div className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-full">
          <img
            src={artist.portraitUrl}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
        <h3 className="mt-5 font-display text-xl transition-colors group-hover:text-gold">
          {artist.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-ink/50">
          {artist.style}
        </p>
      </Link>
    </motion.div>
  )
}
