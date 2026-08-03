import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Calendar, ZoomIn, Play } from 'lucide-react';
import { useArtwork, useArtworks } from '../hooks/useArtworks';
import { useArtist } from '../hooks/useArtists';
import { useFavoritesStore } from '../stores/favoritesStore';
import { ImageViewer } from '../components/ImageViewer';
import { VirtualTour } from '../components/VirtualTour';
import { seedArtists, seedArtworks } from '../data/seed';
import { cn } from '../utils/cn';

export function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: serverArtwork } = useArtwork(id || '');
  const { data: allArtworks = [] } = useArtworks();
  const { toggle, isFavorite } = useFavoritesStore();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const artwork = serverArtwork || seedArtworks.find((w) => w.id === id);
  const { data: serverArtist } = useArtist(artwork?.artistId || '');
  const artist = serverArtist || seedArtists.find((a) => a.id === artwork?.artistId);

  const related = (allArtworks.length > 0 ? allArtworks : seedArtworks)
    .filter((w) => w.id !== artwork?.id && (w.artistId === artwork?.artistId || w.category === artwork?.category))
    .slice(0, 3);

  if (!artwork) {
    return (
      <div className="pt-32 text-center px-6">
        <h2 className="text-2xl font-serif text-obsidian">Œuvre introuvable</h2>
        <Link to="/artworks" className="text-gold hover:underline mt-4 inline-block">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(artwork.id);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          >
            <div className="space-y-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-zoom-in" onClick={() => setViewerOpen(true)}>
                <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              {artwork.galleryImages.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {artwork.galleryImages.slice(1, 4).map((img, i) => (
                    <button key={i} onClick={() => setViewerOpen(true)} className="aspect-square rounded-xl overflow-hidden hover:opacity-80 transition-opacity">
                      <img src={img} alt={`${artwork.title} ${i + 2}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gold text-sm font-medium uppercase tracking-wider mb-4"
              >
                {artwork.category} — {artwork.year}
              </motion.span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-obsidian leading-tight">
                {artwork.title}
              </h1>
              {artist && (
                <Link to={`/artists/${artist.id}`} className="text-xl text-muted mt-4 hover:text-gold transition-colors">
                  {artist.firstName} {artist.lastName}
                </Link>
              )}

              <p className="mt-8 text-obsidian/80 leading-relaxed text-lg">{artwork.description}</p>

              <div className="mt-8 grid grid-cols-2 gap-6 py-6 border-y border-obsidian/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block mb-1">Technique</span>
                  <span className="text-obsidian font-medium">{artwork.technique}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block mb-1">Dimensions</span>
                  <span className="text-obsidian font-medium">{artwork.dimensions}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block mb-1">Année</span>
                  <span className="text-obsidian font-medium">{artwork.year}</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted block mb-1">Disponibilité</span>
                  <span className={cn('font-medium', artwork.isAvailable ? 'text-green-600' : 'text-red-500')}>
                    {artwork.isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => toggle(artwork.id)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-full border transition-colors',
                    favorite
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-obsidian/10 text-obsidian hover:border-gold hover:text-gold'
                  )}
                >
                  <Heart className={cn('w-5 h-5', favorite && 'fill-current')} />
                  {favorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-obsidian/10 text-obsidian hover:border-gold hover:text-gold transition-colors">
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
                <button
                  onClick={() => navigate('/reservations', { state: { artworkId: artwork.id } })}
                  className="flex items-center gap-2 px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-stone transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Réserver une visite
                </button>
                <button
                  onClick={() => setTourOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gold text-obsidian rounded-full hover:bg-gold-light transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Visite virtuelle
                </button>
              </div>
            </div>
          </motion.div>

          {artist && (
            <section className="mt-20">
              <h2 className="text-2xl font-serif text-obsidian mb-6">À propos de l'artiste</h2>
              <div className="bg-cream rounded-2xl p-8 flex flex-col md:flex-row gap-6">
                <img src={artist.portraitUrl} alt={artist.firstName} className="w-24 h-24 rounded-full object-cover" />
                <div>
                  <h3 className="text-xl font-serif text-obsidian">
                    {artist.firstName} {artist.lastName}
                  </h3>
                  <p className="text-sm text-muted mt-1">{artist.nationality}</p>
                  <p className="mt-4 text-obsidian/80 leading-relaxed">{artist.bio}</p>
                  <Link to={`/artists/${artist.id}`} className="inline-block mt-4 text-gold hover:text-gold-dark font-medium">
                    Voir le profil
                  </Link>
                </div>
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-serif text-obsidian mb-6">Œuvres liées</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((w) => (
                  <Link key={w.id} to={`/artworks/${w.id}`} className="group">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                      <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover artwork-image" />
                    </div>
                    <h3 className="font-serif text-lg text-obsidian group-hover:text-gold transition-colors">{w.title}</h3>
                    <p className="text-sm text-muted">{w.artistName}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ImageViewer images={artwork.galleryImages} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
      <VirtualTour artworks={[artwork, ...related]} isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}
