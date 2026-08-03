import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { useExhibition } from '../hooks/useExhibitions';
import { useArtworks } from '../hooks/useArtworks';
import { seedExhibitions, seedArtworks } from '../data/seed';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: serverExhibition } = useExhibition(id || '');
  const { data: allArtworks = [] } = useArtworks();
  const exhibition = serverExhibition || seedExhibitions.find((e) => e.id === id);

  const artworks = (allArtworks.length > 0 ? allArtworks : seedArtworks).filter((w) =>
    exhibition?.artworkIds.includes(w.id)
  );

  if (!exhibition) {
    return (
      <div className="pt-32 text-center px-6">
        <h2 className="text-2xl font-serif text-obsidian">Exposition introuvable</h2>
        <Link to="/exhibitions" className="text-gold hover:underline mt-4 inline-block">
          Retour aux expositions
        </Link>
      </div>
    );
  }

  const start = new Date(exhibition.startDate);
  const end = new Date(exhibition.endDate);

  return (
    <div className="min-h-screen bg-ivory pt-24">
      <div className="relative h-[60vh] min-h-[500px]">
        <img src={exhibition.posterUrl} alt={exhibition.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 bg-gold text-obsidian text-xs font-semibold rounded-full mb-4"
            >
              Exposition
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-ivory max-w-4xl"
            >
              {exhibition.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-serif text-obsidian mb-4">À propos</h2>
              <p className="text-obsidian/80 leading-relaxed text-lg">{exhibition.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-obsidian mb-6">Œuvres exposées</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {artworks.map((artwork) => (
                  <Link key={artwork.id} to={`/artworks/${artwork.id}`} className="group">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                      <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover artwork-image" />
                    </div>
                    <h3 className="font-serif text-xl text-obsidian group-hover:text-gold transition-colors">{artwork.title}</h3>
                    <p className="text-sm text-muted">{artwork.artistName}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 h-fit lg:sticky lg:top-28">
            <div className="bg-cream rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-serif text-obsidian">Informations pratiques</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm text-muted">Dates</p>
                    <p className="text-obsidian font-medium">
                      {format(start, 'dd MMM yyyy', { locale: fr })} – {format(end, 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm text-muted">Lieu</p>
                    <p className="text-obsidian font-medium">{exhibition.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm text-muted">Capacité</p>
                    <p className="text-obsidian font-medium">{exhibition.capacity} visiteurs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm text-muted">Tarif</p>
                    <p className="text-obsidian font-medium">{exhibition.price.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/reservations', { state: { exhibitionId: exhibition.id } })}
                className="w-full py-3 bg-obsidian text-ivory rounded-full font-medium hover:bg-stone transition-colors flex items-center justify-center gap-2"
              >
                Réserver une visite
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
