import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useGalleries } from '../hooks/useGalleries';
import { seedGalleries } from '../data/seed';

export function GalleryPage() {
  const { data: galleries = [] } = useGalleries();
  const allGalleries = galleries.length > 0 ? galleries : seedGalleries;

  return (
    <div className="pt-24 pb-20 lg:pb-32 px-6 lg:px-8 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Galeries partenaires"
          subtitle="Découvrez les institutions culturelles qui font vivre l'art contemporain à travers le monde."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGalleries.map((gallery, i) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
            >
              <img src={gallery.imageUrl} alt={gallery.name} className="w-full h-full object-cover artwork-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="inline-block self-start px-2 py-1 mb-3 text-[10px] font-semibold uppercase tracking-wider bg-gold text-obsidian rounded-md">
                  Partenaire
                </span>
                <h3 className="font-serif text-2xl text-ivory group-hover:text-gold transition-colors">
                  {gallery.name}
                </h3>
                <p className="text-ivory/70 text-sm mt-2 line-clamp-2">{gallery.description}</p>
                <div className="flex items-center gap-2 text-ivory/70 text-sm mt-3">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {gallery.address}, {gallery.city}, {gallery.country}
                  </span>
                </div>
                {gallery.website && (
                  <a
                    href={gallery.website}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 bg-ivory rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-obsidian" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
