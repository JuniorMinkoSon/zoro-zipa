import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QrCode } from 'lucide-react'
import { SearchBar } from '../../components/SearchBar'
import { FilterPanel } from '../../components/FilterPanel'
import { ArtworkCard } from '../../components/ArtworkCard'
import { QRScanner } from '../../components/QRScanner'
import { useArtworks } from '../../api/hooks'

type SortKey = 'recent' | 'oldest' | 'title' | 'popular'

const sortLabels: Record<SortKey, string> = {
  recent: 'Plus récentes',
  oldest: 'Plus anciennes',
  title: 'Titre A→Z',
  popular: 'Populaires',
}

/** Digital-museum catalogue: instant search, dynamic facets, sorting. */
export function ArtworkCatalogPage() {
  const { data: artworks, isLoading } = useArtworks()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [technique, setTechnique] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('recent')
  const [scannerOpen, setScannerOpen] = useState(false)

  const categories = useMemo(
    () => [...new Set(artworks?.map((a) => a.category) ?? [])].sort(),
    [artworks],
  )
  const techniques = useMemo(
    () => [...new Set(artworks?.map((a) => a.technique) ?? [])].sort(),
    [artworks],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = (artworks ?? []).filter(
      (a) =>
        (!q ||
          a.title.toLowerCase().includes(q) ||
          a.artistName.toLowerCase().includes(q) ||
          a.technique.toLowerCase().includes(q)) &&
        (!category || a.category === category) &&
        (!technique || a.technique === technique),
    )
    switch (sort) {
      case 'recent':
        return list.sort((a, b) => b.year - a.year)
      case 'oldest':
        return list.sort((a, b) => a.year - b.year)
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title))
      case 'popular':
        return list.sort((a, b) => b.views - a.views)
    }
  }, [artworks, search, category, technique, sort])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">La collection</p>
      <h1 className="gold-underline font-display text-4xl md:text-5xl">
        Catalogue des œuvres
      </h1>

      <div className="mt-12 flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher une œuvre, un artiste, une technique…"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm outline-none focus:border-gold"
        >
          {(Object.keys(sortLabels) as SortKey[]).map((k) => (
            <option key={k} value={k}>
              {sortLabels[k]}
            </option>
          ))}
        </select>
        <button
          onClick={() => setScannerOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm transition-colors hover:border-gold hover:text-gold"
        >
          <QrCode size={16} /> Scanner
        </button>
      </div>

      <div className="mt-6">
        <FilterPanel
          groups={[
            { label: 'Catégorie', options: categories, selected: category, onSelect: setCategory },
            { label: 'Technique', options: techniques, selected: technique, onSelect: setTechnique },
          ]}
        />
      </div>

      <p className="mt-8 text-sm text-ink/40">
        {isLoading ? 'Chargement de la collection…' : `${filtered?.length ?? 0} œuvre(s)`}
      </p>

      <div className="mt-6 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {filtered?.map((a) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </AnimatePresence>
      </div>

      <QRScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  )
}
