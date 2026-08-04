import { Link, useParams } from 'react-router-dom'
import { CalendarDays, MapPin, Ticket, Building2 } from 'lucide-react'
import { Reveal } from '../../components/Reveal'
import { ArtistCard } from '../../components/ArtistCard'
import { useArtists, useExhibition } from '../../api/hooks'
import { formatDateRange } from '../../utils/format'

/** Immersive exhibition page: poster, practical info, participating artists. */
export function ExhibitionDetailPage() {
  const { id } = useParams()
  const exhibitionId = id ? Number(id) : undefined
  const { data: exhibition, isLoading } = useExhibition(exhibitionId)
  const { data: artists } = useArtists()

  if (isLoading)
    return <p className="px-6 pt-40 text-center text-ink/40">Chargement de l'exposition…</p>
  if (!exhibition)
    return <p className="px-6 pt-40 text-center text-ink/40">Exposition introuvable.</p>

  const participants = artists?.filter((a) => exhibition.artistIds.includes(a.id)) ?? []

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink">
        <img
          src={exhibition.posterUrl}
          alt={exhibition.title}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <Reveal className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-40">
          {exhibition.current && (
            <span className="mb-4 inline-block rounded-full bg-gold px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              En cours
            </span>
          )}
          <h1 className="max-w-3xl font-display text-4xl text-ivory md:text-6xl">
            {exhibition.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-ivory/70">
            <span className="flex items-center gap-2">
              <CalendarDays size={15} className="text-gold" />
              {formatDateRange(exhibition.startDate, exhibition.endDate)}
            </span>
            <span className="flex items-center gap-2">
              <Building2 size={15} className="text-gold" /> {exhibition.galleryName}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-gold" /> {exhibition.location}
            </span>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <p className="text-lg leading-loose text-ink/70">{exhibition.description}</p>
          <Link
            to={`/reservation?exposition=${exhibition.id}`}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <Ticket size={16} /> Réserver une visite
          </Link>
        </Reveal>
      </section>

      {participants.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <Reveal>
            <h2 className="gold-underline font-display text-3xl">
              Artistes participants
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 grid-cols-2 md:grid-cols-4">
            {participants.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
