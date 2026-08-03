import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterOption, SortOption } from '../types';
import { cn } from '../utils/cn';

interface FilterPanelProps {
  filters: FilterOption;
  onFilterChange: (filters: FilterOption) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories: string[];
  techniques: string[];
  artists: string[];
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'name_asc', label: 'Nom A-Z' },
  { value: 'name_desc', label: 'Nom Z-A' },
  { value: 'popular', label: 'Popularité' },
];

export function FilterPanel({
  filters,
  onFilterChange,
  sort,
  onSortChange,
  categories,
  techniques,
  artists,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOption, value: unknown) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
    onSortChange('newest');
  };

  const hasFilters = Object.keys(filters).length > 0 || sort !== 'newest';

  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 block">Trier par</label>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full border transition-all',
                sort === opt.value
                  ? 'bg-obsidian text-ivory border-obsidian'
                  : 'bg-ivory text-obsidian border-obsidian/10 hover:border-gold'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 block">Catégorie</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', filters.category === cat ? undefined : cat)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full border transition-all',
                filters.category === cat
                  ? 'bg-obsidian text-ivory border-obsidian'
                  : 'bg-ivory text-obsidian border-obsidian/10 hover:border-gold'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 block">Technique</label>
        <div className="flex flex-wrap gap-2">
          {techniques.map((tech) => (
            <button
              key={tech}
              onClick={() => updateFilter('technique', filters.technique === tech ? undefined : tech)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full border transition-all',
                filters.technique === tech
                  ? 'bg-obsidian text-ivory border-obsidian'
                  : 'bg-ivory text-obsidian border-obsidian/10 hover:border-gold'
              )}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 block">Artiste</label>
        <select
          value={filters.artist || ''}
          onChange={(e) => updateFilter('artist', e.target.value || undefined)}
          className="w-full px-4 py-2.5 bg-ivory border border-obsidian/10 rounded-lg text-obsidian focus:border-gold focus:outline-none"
        >
          <option value="">Tous les artistes</option>
          {artists.map((artist) => (
            <option key={artist} value={artist}>
              {artist}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm text-muted hover:text-obsidian transition-colors"
        >
          <X className="w-4 h-4" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all',
            isOpen ? 'bg-obsidian text-ivory border-obsidian' : 'bg-ivory text-obsidian border-obsidian/10'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </button>
      </div>

      <div className="hidden lg:block p-6 bg-ivory border border-obsidian/10 rounded-2xl sticky top-24">
        <FilterContent />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="lg:hidden absolute top-full left-0 right-0 mt-2 p-6 bg-ivory border border-obsidian/10 rounded-2xl shadow-xl z-30"
          >
            <FilterContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
