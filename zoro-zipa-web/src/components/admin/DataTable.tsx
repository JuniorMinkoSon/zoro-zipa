import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => number | string
  emptyLabel?: string
}

/** Minimal, elegant admin table. */
export function DataTable<T>({ columns, rows, rowKey, emptyLabel = 'Aucune donnée.' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-ink/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-ink/40">
            {columns.map((c) => (
              <th key={c.header} className={`px-5 py-4 font-medium ${c.className ?? ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-ink/5 transition-colors last:border-0 hover:bg-ivory">
              {columns.map((c) => (
                <td key={c.header} className={`px-5 py-3.5 ${c.className ?? ''}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-ink/40">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
