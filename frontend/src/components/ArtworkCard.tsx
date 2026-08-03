import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '../stores/favoritesStore';
import type { Artwork } from '../types';
import { cn } from '../utils/cn';

interface ArtworkCardProps {
  artwork: Artwork;
  index?: number;
}

export function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  const { toggle, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(artwork.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-ivory rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      <Link to={`/artworks/${artwork.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden relative">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover artwork-image"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <p className="text-ivory/80 text-sm mb-2 line-clamp-2">{artwork.description}</p>
            <span className="inline-flex items-center text-gold text-sm font-medium">
              Voir le détail
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg text-obsidian group-hover:text-gold transition-colors">
              {artwork.title}
            </h3>
            <p className="text-sm text-muted mt-1">{artwork.artistName}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(artwork.id);
            }}
            className={cn(
              'p-2 rounded-full transition-all duration-300 shrink-0',
              favorite ? 'text-red-500 bg-red-50' : 'text-obsidian/40 hover:text-red-500 hover:bg-red-50'
            )}
          >
            <Heart className={cn('w-4 h-4', favorite && 'fill-current')} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          <span className="px-2 py-1 bg-cream rounded-md">{artwork.technique}</span>
          <span>{artwork.year}</span>
        </div>
      </div>
    </motion.div>
  );
}
