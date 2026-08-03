import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import type { Gallery } from '../types';

interface GalleryCardProps {
  gallery: Gallery;
  index?: number;
}

export function GalleryCard({ gallery, index = 0 }: GalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
    >
      <img
        src={gallery.imageUrl}
        alt={gallery.name}
        className="w-full h-full object-cover artwork-image"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="inline-block self-start px-2 py-1 mb-3 text-[10px] font-semibold uppercase tracking-wider bg-gold text-obsidian rounded-md">
          Partenaire
        </span>
        <h3 className="font-serif text-xl md:text-2xl text-ivory group-hover:text-gold transition-colors">
          {gallery.name}
        </h3>
        <div className="flex items-center gap-2 text-ivory/70 text-sm mt-2">
          <MapPin className="w-4 h-4" />
          <span>
            {gallery.city}, {gallery.country}
          </span>
        </div>
        <Link
          to={`/galleries/${gallery.id}`}
          className="absolute top-4 right-4 w-10 h-10 bg-ivory rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
        >
          <ExternalLink className="w-4 h-4 text-obsidian" />
        </Link>
      </div>
    </motion.div>
  );
}
