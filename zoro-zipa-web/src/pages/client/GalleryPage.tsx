import { GalleryCard } from '../../components/GalleryCard'
import { useGalleries } from '../../api/hooks'

/** Partner galleries directory. */
export function GalleryPage() {
  const { data: galleries, isLoading } = useGalleries()

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Nos lieux</p>
      <h1 className="gold-underline font-display text-4xl md:text-5xl">Galeries</h1>

      {isLoading && <p className="mt-10 text-ink/40">Chargement des galeries…</p>}

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {galleries?.map((g) => (
          <GalleryCard key={g.id} gallery={g} />
        ))}
      </div>
    </div>
  )
}
