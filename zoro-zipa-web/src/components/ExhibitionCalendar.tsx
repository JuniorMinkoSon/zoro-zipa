import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Exhibition } from '../types'

interface ExhibitionCalendarProps {
  exhibitions: Exhibition[]
  onSelectDay?: (date: Date, exhibitions: Exhibition[]) => void
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]
const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

/** Interactive month calendar highlighting days with running exhibitions. */
export function ExhibitionCalendar({ exhibitions, onSelectDay }: ExhibitionCalendarProps) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const weeks = useMemo(() => {
    const first = new Date(cursor)
    const offset = (first.getDay() + 6) % 7 // Monday-first
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: daysInMonth },
        (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1),
      ),
    ]
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [cursor])

  const exhibitionsOn = (date: Date) =>
    exhibitions.filter(
      (e) => new Date(e.startDate) <= date && date <= new Date(e.endDate),
    )

  return (
    <div className="border border-ink/10 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Mois précédent"
            className="rounded-full border border-ink/15 p-2 transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Mois suivant"
            className="rounded-full border border-ink/15 p-2 transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-[11px] uppercase tracking-widest text-ink/40">
            {d}
          </div>
        ))}
        {weeks.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const dayExhibitions = exhibitionsOn(date)
          const active = dayExhibitions.length > 0
          return (
            <button
              key={date.toISOString()}
              onClick={() => active && onSelectDay?.(date, dayExhibitions)}
              disabled={!active}
              title={dayExhibitions.map((e) => e.title).join(', ')}
              className={`relative rounded-lg py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-gold/15 font-medium text-ink hover:bg-gold hover:text-ink'
                  : 'text-ink/30'
              }`}
            >
              {date.getDate()}
              {active && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
