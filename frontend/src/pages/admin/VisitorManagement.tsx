import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { useVisitors } from '../../api/hooks'
import type { Visitor } from '../../api/visitor'

const dateTimeFmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const formatMoment = (iso: string | null) => (iso ? dateTimeFmt.format(new Date(iso)) : '—')

/** Digits only, so "+225 07 08" and "0708" match the same visitor. */
const digitsOf = (value: string) => value.replace(/\D/g, '')

function toCsv(visitors: Visitor[]): string {
  const rows = visitors.map((v) => [
    v.firstName,
    v.lastName,
    v.phone,
    v.createdAt,
    v.lastSeenAt,
    String(v.visits),
  ])
  // Quotes doubled and fields wrapped, so a name containing a comma stays in one column.
  const escape = (cell: string) => `"${(cell ?? '').replace(/"/g, '""')}"`
  return [
    ['Prénom', 'Nom', 'Téléphone', 'Première visite', 'Dernier passage', 'Visites'],
    ...rows,
  ]
    .map((row) => row.map(escape).join(','))
    .join('\n')
}

/**
 * The people who filled the entry screen before reaching the site. Read-only:
 * these rows are collected automatically, there is nothing to create here.
 */
export function VisitorManagement() {
  const { data: visitors, isLoading } = useVisitors()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const all = visitors ?? []
    const term = search.trim().toLowerCase()
    if (!term) return all

    const digits = digitsOf(term)
    return all.filter((v) => {
      const name = `${v.firstName} ${v.lastName}`.toLowerCase()
      return name.includes(term) || (digits.length > 0 && digitsOf(v.phone).includes(digits))
    })
  }, [visitors, search])

  const total = visitors?.length ?? 0
  const returning = (visitors ?? []).filter((v) => v.visits > 1).length

  const downloadCsv = () => {
    const blob = new Blob(['﻿' + toCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `visiteurs-zoro-zipa-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <AdminHeader
        title="Visiteurs"
        subtitle={
          isLoading
            ? 'Chargement…'
            : `${total} visiteur(s) · ${returning} revenu(s) au moins une fois`
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un nom ou un numéro"
            className="w-full rounded-full border border-ink/15 py-2 pl-9 pr-4 text-sm outline-none focus:border-gold"
          />
        </div>

        <button
          onClick={downloadCsv}
          disabled={filtered.length === 0}
          className="flex items-center justify-center gap-2 rounded-full border border-gold px-4 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold"
        >
          <Download size={15} />
          Exporter en CSV
        </button>
      </div>

      {search && (
        <p className="mb-3 text-sm text-ink/50">
          {filtered.length} résultat(s) pour « {search} »
        </p>
      )}

      <DataTable
        rows={filtered}
        rowKey={(v) => v.id}
        emptyLabel={
          search
            ? 'Aucun visiteur ne correspond à cette recherche.'
            : "Personne n'a encore rempli l'écran d'entrée."
        }
        columns={[
          {
            header: 'Visiteur',
            render: (v) => (
              <span className="font-medium">
                {v.firstName} {v.lastName}
              </span>
            ),
          },
          {
            header: 'Téléphone',
            render: (v) => (
              <a href={`tel:${v.phone}`} className="tabular-nums text-ink/80 hover:text-gold">
                {v.phone}
              </a>
            ),
          },
          { header: 'Première visite', render: (v) => formatMoment(v.createdAt) },
          { header: 'Dernier passage', render: (v) => formatMoment(v.lastSeenAt) },
          {
            header: 'Visites',
            className: 'text-right',
            render: (v) => (
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs tabular-nums ${
                  v.visits > 1 ? 'bg-gold/15 text-gold' : 'bg-ink/5 text-ink/50'
                }`}
              >
                {v.visits}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
