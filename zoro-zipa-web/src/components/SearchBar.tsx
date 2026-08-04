import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Instant search input with a subtle museum-label style. */
export function SearchBar({ value, onChange, placeholder = 'Rechercher…' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink/15 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-colors focus:border-gold"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
