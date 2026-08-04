import { useMemo, useState } from 'react'
import { SearchBar } from '../../components/SearchBar'
import { ArtistCard } from '../../components/ArtistCard'
import { useArtists } from '../../api/hooks'

/** Directory of validated artists with instant search. */
export function ArtistListPage() {
  const { data: artists, isLoading } = useArtists()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (artists ?? []).filter(
      (a) =>
        a.status === 'VALIDATED' &&
        (!q || a.name.toLowerCase().includes(q) || a.style.toLowerCase().includes(q)),
    )
  }, [artists, search])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Les talents</p>
      <h1 className="gold-underline font-display text-4xl md:text-5xl">Artistes</h1>

      <div className="mt-12 max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un artiste, un style…" />
      </div>

      {isLoading && <p className="mt-10 text-ink/40">Chargement des artistes…</p>}

      <div className="mt-14 grid gap-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((a) => (
          <ArtistCard key={a.id} artist={a} />
        ))}
      </div>
    </div>
  )
}
