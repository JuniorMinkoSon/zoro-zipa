import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../components/SectionTitle';
import { SearchBar } from '../components/SearchBar';
import { ExhibitionCard } from '../components/ExhibitionCard';
import { useExhibitions } from '../hooks/useExhibitions';
import { seedExhibitions } from '../data/seed';
import { cn } from '../utils/cn';

export function ExhibitionListPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'upcoming' | 'past'>('all');
  const { data: exhibitions = [] } = useExhibitions();

  const allExhibitions = exhibitions.length > 0 ? exhibitions : seedExhibitions;

  const filtered = useMemo(() => {
    const now = new Date();
    return allExhibitions.filter((ex) => {
      const start = new Date(ex.startDate);
      const end = new Date(ex.endDate);
      const matchesSearch =
        !search ||
        ex.title.toLowerCase().includes(search.toLowerCase()) ||
        ex.location.toLowerCase().includes(search.toLowerCase());

      let matchesTab = true;
      if (activeTab === 'current') matchesTab = start <= now && end >= now;
      if (activeTab === 'upcoming') matchesTab = start > now;
      if (activeTab === 'past') matchesTab = end < now;

      return matchesSearch && matchesTab;
    });
  }, [allExhibitions, search, activeTab]);

  const tabs = [
    { key: 'all', label: 'Toutes' },
    { key: 'current', label: 'En cours' },
    { key: 'upcoming', label: 'À venir' },
    { key: 'past', label: 'Passées' },
  ];

  return (
    <div className="pt-24 pb-20 lg:pb-32 px-6 lg:px-8 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Expositions"
          subtitle="Découvrez les expositions à ne pas manquer et réservez votre visite."
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                  activeTab === tab.key
                    ? 'bg-obsidian text-ivory border-obsidian'
                    : 'bg-ivory text-obsidian border-obsidian/10 hover:border-gold'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-full md:w-80">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une exposition..." />
          </div>
        </div>

        {filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((exhibition, i) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted">Aucune exposition ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
