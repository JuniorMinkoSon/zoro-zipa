interface FilterGroup {
  label: string
  options: string[]
  selected: string | null
  onSelect: (value: string | null) => void
}

interface FilterPanelProps {
  groups: FilterGroup[]
}

/** Horizontal filter chips grouped by facet (category, technique…). */
export function FilterPanel({ groups }: FilterPanelProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs uppercase tracking-[0.25em] text-ink/40">
            {group.label}
          </span>
          <button
            onClick={() => group.onSelect(null)}
            className={`rounded-full px-4 py-1.5 text-xs transition-all ${
              group.selected === null
                ? 'bg-ink text-ivory'
                : 'border border-ink/15 text-ink/60 hover:border-gold hover:text-gold'
            }`}
          >
            Tout
          </button>
          {group.options.map((option) => (
            <button
              key={option}
              onClick={() =>
                group.onSelect(group.selected === option ? null : option)
              }
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                group.selected === option
                  ? 'bg-gold text-ink'
                  : 'border border-ink/15 text-ink/60 hover:border-gold hover:text-gold'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
