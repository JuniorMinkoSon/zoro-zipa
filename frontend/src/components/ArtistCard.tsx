import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Artist } from '../types';

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/artists/${artist.id}`} className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
          <img
            src={artist.portraitUrl}
            alt={`${artist.firstName} ${artist.lastName}`}
            className="w-full h-full object-cover artwork-image"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-obsidian/40 transition-colors duration-500" />
          <div className="absolute top-4 right-4 w-10 h-10 bg-ivory rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight className="w-5 h-5 text-obsidian" />
          </div>
        </div>
        <h3 className="font-serif text-xl text-obsidian group-hover:text-gold transition-colors">
          {artist.firstName} {artist.lastName}
        </h3>
        <p className="text-sm text-muted mt-1">{artist.nationality}</p>
        <p className="text-sm text-obsidian/70 mt-2 line-clamp-2">{artist.style}</p>
      </Link>
    </motion.div>
  );
}
