import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ArtworkCard } from '../../components/ArtworkCard'
import { useArtworks } from '../../api/hooks'
import { useFavorites } from '../../store/favorites'

/** Personal collection of favorite artworks. */
export function FavoritesPage() {
  const { data: artworks } = useArtworks()
  const ids = useFavorites((s) => s.ids)
  const favorites = artworks?.filter((a) => ids.includes(a.id)) ?? []

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">
        Votre collection
      </p>
      <h1 className="gold-underline font-display text-4xl md:text-5xl">Favoris</h1>

      {favorites.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <Heart size={40} className="text-ink/20" />
          <p className="mt-4 text-ink/50">
            Vous n'avez pas encore d'œuvres favorites.
          </p>
          <Link
            to="/oeuvres"
            className="mt-6 rounded-full bg-ink px-8 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            Explorer le catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </div>
      )}
    </div>
  )
}
