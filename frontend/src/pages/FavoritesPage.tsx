import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { ArtworkCard } from '../components/ArtworkCard';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useArtworks } from '../hooks/useArtworks';
import { seedArtworks } from '../data/seed';

export function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const { data: artworks = [] } = useArtworks();
  const allArtworks = artworks.length > 0 ? artworks : seedArtworks;
  const favoriteArtworks = allArtworks.filter((w) => favorites.includes(w.id));

  return (
    <div className="pt-24 pb-20 lg:pb-32 px-6 lg:px-8 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Vos favoris"
          subtitle="Retrouvez les œuvres qui ont capturé votre attention."
        />

        {favoriteArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteArtworks.map((artwork, i) => (
              <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-cream rounded-2xl">
            <Heart className="w-12 h-12 text-gold/40 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-obsidian mb-2">Aucun favori</h3>
            <p className="text-muted mb-6 max-w-md mx-auto">
              Parcourez notre catalogue et ajoutez les œuvres qui vous touchent à vos favoris.
            </p>
            <Link
              to="/artworks"
              className="inline-flex items-center gap-2 px-6 py-3 bg-obsidian text-ivory rounded-full hover:bg-stone transition-colors"
            >
              Découvrir les œuvres <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
