import { Search, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher...', className }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3.5 bg-ivory border border-obsidian/10 rounded-full text-obsidian placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-obsidian"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
