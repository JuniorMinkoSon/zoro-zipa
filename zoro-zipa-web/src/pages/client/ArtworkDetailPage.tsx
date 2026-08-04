import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarPlus, Heart, Mail, Share2 } from 'lucide-react'
import { Reveal } from '../../components/Reveal'
import { ImageViewer } from '../../components/ImageViewer'
import { Modal } from '../../components/Modal'
import { useArtwork } from '../../api/hooks'
import { useFavorites } from '../../store/favorites'

/** Immersive artwork page: HD gallery, story, specs and actions. */
export function ArtworkDetailPage() {
  const { id } = useParams()
  const artworkId = id ? Number(id) : undefined
  const { data: artwork, isLoading } = useArtwork(artworkId)
  const { toggle, isFavorite } = useFavorites()
  const [contactOpen, setContactOpen] = useState(false)
  const [shared, setShared] = useState(false)

  if (isLoading)
    return <p className="px-6 pt-40 text-center text-ink/40">Chargement de l'œuvre…</p>
  if (!artwork)
    return <p className="px-6 pt-40 text-center text-ink/40">Œuvre introuvable.</p>

  const favorite = isFavorite(artwork.id)
  const images = artwork.images.length ? artwork.images : [artwork.imageUrl]

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: artwork.title, url }).catch(() => undefined)
    } else {
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const specs = [
    { label: 'Artiste', value: artwork.artistName },
    { label: 'Technique', value: artwork.technique },
    { label: 'Dimensions', value: artwork.dimensions },
    { label: 'Année', value: String(artwork.year) },
    { label: 'Catégorie', value: artwork.category },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <ImageViewer images={images} alt={artwork.title} />
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {artwork.category}
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{artwork.title}</h1>
          <Link
            to={`/artistes/${artwork.artistId}`}
            className="mt-3 inline-block font-display text-xl italic text-ink/60 transition-colors hover:text-gold"
          >
            {artwork.artistName}
          </Link>

          <p className="mt-8 leading-relaxed text-ink/70">{artwork.description}</p>

          <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between py-3.5 text-sm">
                <dt className="uppercase tracking-[0.2em] text-ink/40">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => toggle(artwork.id)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-all ${
                favorite
                  ? 'bg-gold text-ink'
                  : 'border border-ink/20 hover:border-gold hover:text-gold'
              }`}
            >
              <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
              {favorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
            </button>
            <button
              onClick={share}
              className="flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm transition-colors hover:border-gold hover:text-gold"
            >
              <Share2 size={16} /> {shared ? 'Lien copié !' : 'Partager'}
            </button>
            <Link
              to="/reservation"
              className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
            >
              <CalendarPlus size={16} /> Réserver une visite
            </Link>
            <button
              onClick={() => setContactOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm transition-colors hover:border-gold hover:text-gold"
            >
              <Mail size={16} /> Contacter la galerie
            </button>
          </div>
        </Reveal>
      </div>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Contacter la galerie">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setContactOpen(false)
          }}
        >
          <input
            required
            placeholder="Votre email"
            type="email"
            className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <textarea
            required
            rows={4}
            placeholder={`Votre message à propos de « ${artwork.title} »…`}
            className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-ink py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            Envoyer le message
          </button>
        </form>
      </Modal>
    </div>
  )
}
