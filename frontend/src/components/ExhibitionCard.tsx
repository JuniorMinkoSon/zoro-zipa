import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Exhibition } from '../types';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  index?: number;
}

export function ExhibitionCard({ exhibition, index = 0 }: ExhibitionCardProps) {
  const start = new Date(exhibition.startDate);
  const end = new Date(exhibition.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-ivory rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      <Link to={`/exhibitions/${exhibition.id}`} className="block">
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={exhibition.posterUrl}
            alt={exhibition.title}
            className="w-full h-full object-cover artwork-image"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay" />
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-ivory/90 backdrop-blur-sm rounded-full text-xs font-medium text-obsidian">
            Exposition
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-serif text-xl md:text-2xl text-ivory group-hover:text-gold transition-colors">
              {exhibition.title}
            </h3>
          </div>
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Calendar className="w-4 h-4 text-gold" />
          <span>
            {format(start, 'dd MMM', { locale: fr })} – {format(end, 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin className="w-4 h-4 text-gold" />
          <span>{exhibition.location}</span>
        </div>
        <p className="text-sm text-obsidian/70 line-clamp-2">{exhibition.description}</p>
        <Link
          to={`/exhibitions/${exhibition.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
        >
          Réserver une visite
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
