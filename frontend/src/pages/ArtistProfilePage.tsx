import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Calendar } from 'lucide-react';
import { useArtist } from '../hooks/useArtists';
import { useArtworks } from '../hooks/useArtworks';
import { seedArtists, seedArtworks } from '../data/seed';

export function ArtistProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: serverArtist } = useArtist(id || '');
  const { data: allArtworks = [] } = useArtworks();
  const artist = serverArtist || seedArtists.find((a) => a.id === id);
  const artworks = (allArtworks.length > 0 ? allArtworks : seedArtworks).filter((w) => w.artistId === id);

  if (!artist) {
    return (
      <div className="pt-32 text-center px-6">
        <h2 className="text-2xl font-serif text-obsidian">Artiste introuvable</h2>
        <Link to="/artists" className="text-gold hover:underline mt-4 inline-block">
          Retour aux artistes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-24">
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={artist.portraitUrl}
          alt={`${artist.firstName} ${artist.lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold text-sm font-medium uppercase tracking-wider"
            >
              {artist.nationality}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-ivory mt-3"
            >
              {artist.firstName} {artist.lastName}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-serif text-obsidian mb-4">Biographie</h2>
              <p className="text-obsidian/80 leading-relaxed text-lg">{artist.bio}</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-obsidian mb-4">Parcours</h2>
              <p className="text-obsidian/80 leading-relaxed text-lg">{artist.journey}</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-obsidian mb-4">Style artistique</h2>
              <p className="text-obsidian/80 leading-relaxed text-lg">{artist.style}</p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-obsidian mb-6">Œuvres de l'artiste</h2>
              {artworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {artworks.map((artwork, i) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={`/artworks/${artwork.id}`} className="group block">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                          <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover artwork-image" />
                        </div>
                        <h3 className="font-serif text-xl text-obsidian group-hover:text-gold transition-colors">{artwork.title}</h3>
                        <p className="text-sm text-muted mt-1">{artwork.year} — {artwork.technique}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Aucune œuvre disponible pour cet artiste.</p>
              )}
            </section>
          </div>

          <aside className="space-y-6 h-fit lg:sticky lg:top-28">
            <div className="bg-cream rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-serif text-obsidian">Informations</h3>
              <div className="flex items-center gap-3 text-sm text-obsidian/80">
                <Calendar className="w-5 h-5 text-gold" />
                <span>Né(e) en {artist.birthYear}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-obsidian/80">
                <Globe className="w-5 h-5 text-gold" />
                <span>{artist.nationality}</span>
              </div>
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium text-sm"
                >
                  Site web officiel
                </a>
              )}
              <div className="pt-4 border-t border-obsidian/10">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${artist.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {artist.isVerified ? 'Artiste vérifié' : 'En attente de vérification'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
