import { useArtists } from '../hooks/useArtists';
import { SectionTitle } from '../components/SectionTitle';
import { SearchBar } from '../components/SearchBar';
import { ArtistCard } from '../components/ArtistCard';
import { seedArtists } from '../data/seed';
import { useState, useMemo } from 'react';

export function ArtistsPage() {
  const [search, setSearch] = useState('');
  const { data: artists = [] } = useArtists();
  const allArtists = artists.length > 0 ? artists : seedArtists;

  const filtered = useMemo(() => {
    if (!search) return allArtists;
    const q = search.toLowerCase();
    return allArtists.filter(
      (a) =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
        a.style.toLowerCase().includes(q) ||
        a.nationality.toLowerCase().includes(q)
    );
  }, [allArtists, search]);

  return (
    <div className="pt-24 pb-20 lg:pb-32 px-6 lg:px-8 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Artistes"
          subtitle="Découvrez les créateurs qui donnent vie à l'art contemporain."
        />

        <div className="max-w-xl mx-auto mb-12">
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un artiste..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
