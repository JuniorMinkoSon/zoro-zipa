import { useState } from 'react'
import { KeyRound, ShieldCheck, Trash2, X } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { useDeleteEntity, useUpdateEntity, useUsers } from '../../api/hooks'
import type { User } from '../../types'
import { formatDate } from '../../utils/format'

/**
 * Administrator accounts. Since the showcase site stopped asking visitors to
 * sign in, an account only ever means "someone who administers the platform";
 * any CLIENT account left over grants nothing and is listed apart, to be removed.
 */
export function UserManagement() {
  const { data: users } = useUsers()
  const update = useUpdateEntity<User & { password?: string }>('users')
  const remove = useDeleteEntity('users')

  const [passwordUser, setPasswordUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const admins = (users ?? []).filter((u) => u.role === 'ADMIN')
  const leftovers = (users ?? []).filter((u) => u.role !== 'ADMIN')

  const closePasswordModal = () => {
    setPasswordUser(null)
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordUser) return

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas')
      return
    }

    setSaving(true)
    setError('')
    try {
      await update.mutateAsync({ id: passwordUser.id, body: { ...passwordUser, password: newPassword } })
      closePasswordModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminHeader
        title="Administrateurs"
        subtitle={`${admins.length} compte(s) ayant accès à l'administration`}
      />

      <DataTable
        rows={admins}
        rowKey={(u) => u.id}
        emptyLabel="Aucun administrateur."
        columns={[
          { header: 'Nom', render: (u) => <span className="font-medium">{u.name}</span> },
          { header: 'Email', render: (u) => u.email },
          { header: 'Créé le', render: (u) => formatDate(u.createdAt) },
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
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => setPasswordUser(u)}
                  title="Changer le mot de passe"
                  className="rounded-full p-2 text-ink/50 hover:bg-gold/10 hover:text-gold"
                >
                  <KeyRound size={15} />
                </button>
                <button
                  onClick={() => remove.mutate(u.id)}
                  title="Supprimer"
                  className="rounded-full p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      {leftovers.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg text-ink">Anciens comptes clients</h2>
          <p className="mb-4 mt-1 max-w-2xl text-sm text-ink/50">
            Les visiteurs ne créent plus de compte : ils laissent leur nom et leur numéro sur
            l'écran d'entrée. Ces comptes ne donnent plus accès à rien et peuvent être supprimés.
          </p>

          <DataTable
            rows={leftovers}
            rowKey={(u) => u.id}
            columns={[
              { header: 'Nom', render: (u) => <span className="font-medium">{u.name}</span> },
              { header: 'Email', render: (u) => u.email },
              { header: 'Créé le', render: (u) => formatDate(u.createdAt) },
              {
                header: 'Actions',
                className: 'text-right',
                render: (u) => (
                  <button
                    onClick={() => remove.mutate(u.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={13} /> Supprimer
                  </button>
                ),
              },
            ]}
          />
        </section>
      )}

      {passwordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Changer le mot de passe</h2>
              <button onClick={closePasswordModal} className="text-ink/40 hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink/60">
              Pour <span className="font-medium text-ink">{passwordUser.name}</span> ({passwordUser.email})
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-ink/70">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  autoFocus
                  required
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink/70">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:border-ink/30"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink hover:bg-gold-soft disabled:opacity-60"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
