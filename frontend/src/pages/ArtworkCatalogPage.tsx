import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../components/SectionTitle';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ArtworkCard } from '../components/ArtworkCard';
import { useArtworks } from '../hooks/useArtworks';
import { seedArtworks } from '../data/seed';
import type { FilterOption, SortOption } from '../types';

export function ArtworkCatalogPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterOption>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const { data: artworks = [] } = useArtworks();

  const allArtworks = artworks.length > 0 ? artworks : seedArtworks;

  const categories = useMemo(() => Array.from(new Set(allArtworks.map((w) => w.category))), [allArtworks]);
  const techniques = useMemo(() => Array.from(new Set(allArtworks.map((w) => w.technique))), [allArtworks]);
  const artists = useMemo(() => Array.from(new Set(allArtworks.map((w) => w.artistName))), [allArtworks]);

  const filtered = useMemo(() => {
    let result = allArtworks.filter((w) => {
      const matchesSearch =
        !search ||
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.artistName.toLowerCase().includes(search.toLowerCase()) ||
        w.technique.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !filters.category || w.category === filters.category;
      const matchesTechnique = !filters.technique || w.technique === filters.technique;
      const matchesArtist = !filters.artist || w.artistName === filters.artist;

      return matchesSearch && matchesCategory && matchesTechnique && matchesArtist;
    });

    switch (sort) {
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [allArtworks, search, filters, sort]);

  return (
    <div className="pt-24 pb-20 lg:pb-32 px-6 lg:px-8 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Catalogue des œuvres"
          subtitle="Explorez notre collection comme dans un musée numérique. Filtrez, triez et laissez-vous guider."
        />

        <div className="mb-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une œuvre, un artiste, une technique..." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            categories={categories}
            techniques={techniques}
            artists={artists}
          />

          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted">
                {filtered.length} œuvre{filtered.length > 1 ? 's' : ''}
              </p>
            </div>

            {filtered.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {filtered.map((artwork, i) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted">Aucune œuvre ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
