import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Heart } from 'lucide-react'
import type { Artwork } from '../types'
import { useFavorites } from '../store/favorites'

interface ArtworkCardProps {
  artwork: Artwork
}

/** Museum-style artwork card: image zoom + info reveal on hover. */
export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { toggle, isFavorite } = useFavorites()
  const favorite = isFavorite(artwork.id)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group relative overflow-hidden bg-ink"
    >
      <Link to={`/oeuvres/${artwork.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <h3 className="font-display text-lg text-ivory">{artwork.title}</h3>
          <p className="mt-1 text-sm text-gold">{artwork.artistName}</p>
          <p className="mt-0.5 text-xs text-ivory/60">
            {artwork.technique} · {artwork.year}
          </p>
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/60 px-4 py-1.5 text-xs text-gold">
            <Eye size={13} /> Voir le détail
          </span>
        </div>
      </Link>
      <button
        onClick={() => toggle(artwork.id)}
        aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-sm transition-all ${
          favorite
            ? 'bg-gold text-ink'
            : 'bg-ink/40 text-ivory opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart size={15} fill={favorite ? 'currentColor' : 'none'} />
      </button>
    </motion.article>
  )
}
