import { ShieldCheck, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { useDeleteEntity, useUpdateEntity, useUsers } from '../../api/hooks'
import type { User, UserRole } from '../../types'
import { formatDate } from '../../utils/format'

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  GALLERY: 'Galerie',
  VISITOR: 'Visiteur',
}

/** Platform user management: roles, activation, deletion. */
export function UserManagement() {
  const { data: users } = useUsers()
  const update = useUpdateEntity<User>('users')
  const remove = useDeleteEntity('users')

  return (
    <div>
      <AdminHeader
        title="Gestion des utilisateurs"
        subtitle={`${users?.length ?? 0} utilisateur(s)`}
      />

      <DataTable
        rows={users ?? []}
        rowKey={(u) => u.id}
        columns={[
          { header: 'Nom', render: (u) => <span className="font-medium">{u.name}</span> },
          { header: 'Email', render: (u) => u.email },
          {
            header: 'Rôle',
            render: (u) => (
              <select
                value={u.role}
                onChange={(e) =>
                  update.mutate({ id: u.id, body: { ...u, role: e.target.value as UserRole } })
                }
                className="rounded-full border border-ink/10 px-3 py-1 text-xs outline-none focus:border-gold"
              >
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            ),
          },
          { header: 'Inscription', render: (u) => formatDate(u.createdAt) },
          {
            header: 'Statut',
            render: (u) => (
              <button
                onClick={() => update.mutate({ id: u.id, body: { ...u, active: !u.active } })}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                  u.active ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink/50'
                }`}
              >
                <ShieldCheck size={13} /> {u.active ? 'Actif' : 'Inactif'}
              </button>
            ),
          },
          {
            header: 'Actions',
            className: 'text-right',
            render: (u) => (
              <button onClick={() => remove.mutate(u.id)} title="Supprimer" className="rounded-full p-2 text-red-500 hover:bg-red-50">
                <Trash2 size={15} />
              </button>
            ),
          },
        ]}
      />
    </div>
  )
}
