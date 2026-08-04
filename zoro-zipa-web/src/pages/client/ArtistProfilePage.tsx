import { useParams } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { ArtworkCard } from '../../components/ArtworkCard'
import { useArtist, useArtworks } from '../../api/hooks'

/** Magazine-style artist profile: portrait, biography, journey and works. */
export function ArtistProfilePage() {
  const { id } = useParams()
  const artistId = id ? Number(id) : undefined
  const { data: artist, isLoading } = useArtist(artistId)
  const { data: artworks } = useArtworks()

  if (isLoading)
    return <p className="px-6 pt-40 text-center text-ink/40">Chargement du profil…</p>
  if (!artist)
    return <p className="px-6 pt-40 text-center text-ink/40">Artiste introuvable.</p>

  const works = artworks?.filter((a) => a.artistId === artist.id) ?? []

  return (
    <div>
      <section className="bg-ink pb-20 pt-32 text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[320px_1fr]">
          <Reveal>
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={artist.portraitUrl}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">
              {artist.nationality} · {artist.style}
            </p>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">{artist.name}</h1>
            <p className="mt-8 max-w-2xl font-display text-lg italic leading-relaxed text-ivory/70">
              « {artist.bio} »
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <h2 className="gold-underline font-display text-3xl">Parcours</h2>
          <p className="mt-8 whitespace-pre-line leading-loose text-ink/70">
            {artist.journey}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <Reveal>
          <h2 className="gold-underline font-display text-3xl">
            Œuvres de l'artiste
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {works.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </div>
        {works.length === 0 && (
          <p className="mt-8 text-ink/40">Aucune œuvre publiée pour le moment.</p>
        )}
      </section>
    </div>
  )
}
