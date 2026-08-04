import { useState } from 'react'
import { ExhibitionCard } from '../../components/ExhibitionCard'
import { ExhibitionCalendar } from '../../components/ExhibitionCalendar'
import { useExhibitions } from '../../api/hooks'
import type { Exhibition } from '../../types'

/** Event-driven exhibitions page with an interactive calendar. */
export function ExhibitionListPage() {
  const { data: exhibitions, isLoading } = useExhibitions()
  const [dayFilter, setDayFilter] = useState<{ date: Date; list: Exhibition[] } | null>(null)

  const list = dayFilter?.list ?? exhibitions ?? []

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Événements</p>
      <h1 className="gold-underline font-display text-4xl md:text-5xl">Expositions</h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {isLoading && <p className="text-ink/40">Chargement des expositions…</p>}
          {dayFilter && (
            <div className="mb-6 flex items-center gap-3 text-sm">
              <span className="text-ink/60">
                Expositions du{' '}
                {dayFilter.date.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              <button onClick={() => setDayFilter(null)} className="text-gold underline">
                Tout afficher
              </button>
            </div>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            {list.map((e) => (
              <ExhibitionCard key={e.id} exhibition={e} />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ExhibitionCalendar
            exhibitions={exhibitions ?? []}
            onSelectDay={(date, list) => setDayFilter({ date, list })}
          />
          <p className="mt-4 text-xs text-ink/40">
            Cliquez sur une date dorée pour voir les expositions du jour.
          </p>
        </aside>
      </div>
    </div>
  )
}
