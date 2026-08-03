import { useReservations, useUpdateReservation, useDeleteReservation } from '../../hooks/useReservations';
import { DataTable } from '../../components/DataTable';
import { AdminHeader } from '../../components/AdminHeader';
import { seedExhibitions } from '../../data/seed';
import { cn } from '../../utils/cn';
import type { Reservation } from '../../types';

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export function ReservationManagement() {
  const { data: reservations = [] } = useReservations();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();

  const allReservations: Reservation[] =
    reservations.length > 0
      ? reservations
      : [
          {
            id: 'r1',
            exhibitionId: seedExhibitions[0].id,
            exhibitionTitle: seedExhibitions[0].title,
            userId: 'u2',
            userName: 'Marie Dupont',
            email: 'marie@example.com',
            date: '2025-10-15',
            time: '14:00',
            visitors: 2,
            status: 'confirmed',
            totalPrice: 50,
            createdAt: '2024-08-01T10:00:00Z',
          },
        ];

  const handleStatus = async (res: Reservation, status: Reservation['status']) => {
    await updateReservation.mutateAsync({ id: res.id, data: { status } });
  };

  const handleDelete = async (res: Reservation) => {
    if (confirm(`Supprimer la réservation de ${res.userName} ?`)) {
      await deleteReservation.mutateAsync(res.id);
    }
  };

  return (
    <div>
      <AdminHeader title="Gestion des réservations" description="Suivez et gérez les réservations de visites." />

      <DataTable
        columns={[
          { key: 'userName', header: 'Visiteur' },
          { key: 'exhibitionTitle', header: 'Exposition' },
          {
            key: 'date',
            header: 'Date & heure',
            render: (r) => `${r.date} à ${r.time}`,
          },
          { key: 'visitors', header: 'Visiteurs' },
          {
            key: 'status',
            header: 'Statut',
            render: (r) => (
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColors[r.status])}>
                {statusLabels[r.status]}
              </span>
            ),
          },
        ]}
        data={allReservations}
        onEdit={() => {}}
        onDelete={handleDelete}
        extraActions={(r) => (
          <select
            value={r.status}
            onChange={(e) => handleStatus(r, e.target.value as Reservation['status'])}
            className="text-xs px-2 py-1 rounded-lg border border-obsidian/10 bg-ivory"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
