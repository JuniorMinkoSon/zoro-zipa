import { Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import {
  useDeleteEntity,
  useReservations,
  useUpdateEntity,
} from '../../api/hooks'
import type { Reservation, ReservationStatus } from '../../types'
import { formatDate } from '../../utils/format'

const statusStyles: Record<ReservationStatus, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const statusLabels: Record<ReservationStatus, string> = {
  CONFIRMED: 'Confirmée',
  PENDING: 'En attente',
  CANCELLED: 'Annulée',
}

/** Reservation follow-up: status changes and deletion. */
export function ReservationManagement() {
  const { data: reservations } = useReservations()
  const update = useUpdateEntity<Reservation>('reservations')
  const remove = useDeleteEntity('reservations')

  return (
    <div>
      <AdminHeader
        title="Gestion des réservations"
        subtitle={`${reservations?.length ?? 0} réservation(s)`}
      />

      <DataTable
        rows={reservations ?? []}
        rowKey={(r) => r.id}
        columns={[
          { header: 'Code', render: (r) => <span className="font-mono text-xs text-gold">{r.code}</span> },
          { header: 'Visiteur', render: (r) => <span className="font-medium">{r.fullName}</span> },
          { header: 'Exposition', render: (r) => r.exhibitionTitle },
          { header: 'Date', render: (r) => `${formatDate(r.visitDate)} · ${r.timeSlot}` },
          { header: 'Visiteurs', render: (r) => r.visitors },
          {
            header: 'Statut',
            render: (r) => (
              <select
                value={r.status}
                onChange={(e) =>
                  update.mutate({ id: r.id, body: { ...r, status: e.target.value as ReservationStatus } })
                }
                className={`rounded-full border-0 px-3 py-1 text-xs outline-none ${statusStyles[r.status]}`}
              >
                {(Object.keys(statusLabels) as ReservationStatus[]).map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            ),
          },
          {
            header: 'Actions',
            className: 'text-right',
            render: (r) => (
              <button onClick={() => remove.mutate(r.id)} title="Supprimer" className="rounded-full p-2 text-red-500 hover:bg-red-50">
                <Trash2 size={15} />
              </button>
            ),
          },
        ]}
      />
    </div>
  )
}
