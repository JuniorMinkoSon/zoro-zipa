import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '../../components/HeroSection'
import { SectionTitle } from '../../components/SectionTitle'
import { ArtworkCard } from '../../components/ArtworkCard'
import { ArtistCard } from '../../components/ArtistCard'
import { ExhibitionCard } from '../../components/ExhibitionCard'
import { GalleryCard } from '../../components/GalleryCard'
import { Reveal } from '../../components/Reveal'
import {
  useArtists,
  useArtworks,
  useExhibitions,
  useGalleries,
} from '../../api/hooks'

function SectionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-gold"
    >
      {label}
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

export function HomePage() {
  const { data: exhibitions } = useExhibitions()
  const { data: artists } = useArtists()
  const { data: artworks } = useArtworks()
  const { data: galleries } = useGalleries()

  const current = exhibitions?.filter((e) => e.current).slice(0, 3) ?? []
  const trending = artworks?.filter((a) => a.trending).slice(0, 4) ?? []
  const popularArtists = artists?.filter((a) => a.status === 'VALIDATED').slice(0, 4) ?? []
  const partners = galleries?.filter((g) => g.partner).slice(0, 3) ?? []

  return (
    <div>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-10 flex items-end justify-between">
          <SectionTitle eyebrow="À l'affiche" title="Expositions actuelles" />
          <SectionLink to="/expositions" label="Toutes les expositions" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {current.map((e) => (
            <ExhibitionCard key={e.id} exhibition={e} />
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between">
            <Reveal>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">
                La collection
              </p>
              <h2 className="gold-underline font-display text-3xl font-medium text-ivory md:text-4xl">
                Œuvres tendances
              </h2>
            </Reveal>
            <Link
              to="/oeuvres"
              className="group flex items-center gap-2 text-sm text-ivory/60 transition-colors hover:text-gold"
            >
              Tout le catalogue
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-12 flex items-end justify-between">
          <SectionTitle eyebrow="Les talents" title="Artistes populaires" />
          <SectionLink to="/artistes" label="Tous les artistes" />
        </div>
        <div className="grid gap-10 grid-cols-2 lg:grid-cols-4">
          {popularArtists.map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      </section>

      <section className="bg-ivory-dim py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <SectionTitle eyebrow="Nos lieux" title="Galeries partenaires" />
            <SectionLink to="/galeries" label="Toutes les galeries" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {partners.map((g) => (
              <GalleryCard key={g.id} gallery={g} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-center">
        <Reveal className="mx-auto max-w-2xl px-6">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
            Vivez l'expérience
          </p>
          <h2 className="font-display text-3xl text-ivory md:text-5xl">
            Réservez votre prochaine visite
          </h2>
          <p className="mt-4 text-ivory/60">
            Choisissez une exposition, une date, un horaire — et recevez votre
            billet avec QR code.
          </p>
          <Link
            to="/reservation"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
          >
            Réserver une visite
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
