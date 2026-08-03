import { useUsers, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';
import { DataTable } from '../../components/DataTable';
import { AdminHeader } from '../../components/AdminHeader';
import { seedUsers } from '../../data/seed';
import { cn } from '../../utils/cn';
import type { User } from '../../types';

const roleLabels: Record<string, string> = {
  visitor: 'Visiteur',
  admin: 'Administrateur',
  gallery_manager: 'Galerie',
  artist: 'Artiste',
};

export function UserManagement() {
  const { data: users = [] } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const allUsers = users.length > 0 ? users : seedUsers;

  const handleRole = async (user: User, role: User['role']) => {
    await updateUser.mutateAsync({ id: user.id, data: { role } });
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Supprimer ${user.firstName} ${user.lastName} ?`)) {
      await deleteUser.mutateAsync(user.id);
    }
  };

  return (
    <div>
      <AdminHeader title="Gestion des utilisateurs" description="Gérez les comptes et rôles utilisateurs." />

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Nom',
            render: (u) => `${u.firstName} ${u.lastName}`,
          },
          { key: 'email', header: 'Email' },
          {
            key: 'role',
            header: 'Rôle',
            render: (u) => (
              <select
                value={u.role}
                onChange={(e) => handleRole(u, e.target.value as User['role'])}
                className="text-xs px-2 py-1 rounded-lg border border-obsidian/10 bg-ivory"
              >
                {Object.entries(roleLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: 'isActive',
            header: 'Actif',
            render: (u) => (
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}
              >
                {u.isActive ? 'Oui' : 'Non'}
              </span>
            ),
          },
        ]}
        data={allUsers}
        onDelete={handleDelete}
      />
    </div>
  );
}
