import { useState } from 'react'
import { BadgeCheck, Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormField, inputClass } from '../../components/admin/FormField'
import { Modal } from '../../components/Modal'
import {
  useArtists,
  useCreateEntity,
  useDeleteEntity,
  useUpdateEntity,
} from '../../api/hooks'
import type { Artist, ArtistStatus } from '../../types'

const statusStyles: Record<ArtistStatus, string> = {
  VALIDATED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  SUSPENDED: 'bg-red-100 text-red-700',
}

const statusLabels: Record<ArtistStatus, string> = {
  VALIDATED: 'Validé',
  PENDING: 'En attente',
  SUSPENDED: 'Suspendu',
}

const emptyForm = {
  name: '',
  portraitUrl: '',
  bio: '',
  journey: '',
  style: '',
  nationality: '',
  status: 'PENDING' as ArtistStatus,
}

/** Artist CRUD + validation workflow. */
export function ArtistManagement() {
  const { data: artists } = useArtists()
  const create = useCreateEntity<Artist>('artists')
  const update = useUpdateEntity<Artist>('artists')
  const remove = useDeleteEntity('artists')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Artist | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }
  const openEdit = (artist: Artist) => {
    setEditing(artist)
    setForm({ ...artist })
    setModalOpen(true)
  }
  const submit = () => {
    if (editing) update.mutate({ id: editing.id, body: form })
    else create.mutate(form)
    setModalOpen(false)
  }
  const validate = (artist: Artist) =>
    update.mutate({ id: artist.id, body: { ...artist, status: 'VALIDATED' } })

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div>
      <AdminHeader
        title="Gestion des artistes"
        subtitle={`${artists?.length ?? 0} artiste(s)`}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <Plus size={15} /> Nouvel artiste
          </button>
        }
      />

      <DataTable
        rows={artists ?? []}
        rowKey={(a) => a.id}
        columns={[
          {
            header: 'Photo',
            render: (a) => (
              <img src={a.portraitUrl} alt={a.name} className="h-10 w-10 rounded-full object-cover" />
            ),
          },
          { header: 'Nom', render: (a) => <span className="font-medium">{a.name}</span> },
          { header: 'Style', render: (a) => a.style },
          {
            header: 'Statut',
            render: (a) => (
              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[a.status]}`}>
                {statusLabels[a.status]}
              </span>
            ),
          },
          {
            header: 'Actions',
            className: 'text-right',
            render: (a) => (
              <div className="flex justify-end gap-2">
                {a.status !== 'VALIDATED' && (
                  <button
                    onClick={() => validate(a)}
                    title="Valider"
                    className="rounded-full p-2 text-green-600 hover:bg-green-50"
                  >
                    <BadgeCheck size={16} />
                  </button>
                )}
                <button onClick={() => openEdit(a)} title="Modifier" className="rounded-full p-2 text-ink/60 hover:bg-ink/5">
                  <Pencil size={15} />
                </button>
                <button onClick={() => remove.mutate(a.id)} title="Supprimer" className="rounded-full p-2 text-red-500 hover:bg-red-50">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier l’artiste' : 'Nouvel artiste'} wide>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <FormField label="Nom">
            <input required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Nationalité">
            <input className={inputClass} value={form.nationality} onChange={(e) => set('nationality', e.target.value)} />
          </FormField>
          <FormField label="Style artistique">
            <input className={inputClass} value={form.style} onChange={(e) => set('style', e.target.value)} />
          </FormField>
          <FormField label="Statut">
            <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value as ArtistStatus)}>
              {(Object.keys(statusLabels) as ArtistStatus[]).map((s) => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="URL du portrait">
              <input className={inputClass} value={form.portraitUrl} onChange={(e) => set('portraitUrl', e.target.value)} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Biographie">
              <textarea rows={3} className={inputClass} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Parcours">
              <textarea rows={4} className={inputClass} value={form.journey} onChange={(e) => set('journey', e.target.value)} />
            </FormField>
          </div>
          <button
            type="submit"
            className="rounded-full bg-ink px-8 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink md:col-span-2"
          >
            {editing ? 'Enregistrer' : 'Créer l’artiste'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
