import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormField, inputClass } from '../../components/admin/FormField'
import { Modal } from '../../components/Modal'
import {
  useCreateEntity,
  useDeleteEntity,
  useGalleries,
  useUpdateEntity,
} from '../../api/hooks'
import type { Gallery } from '../../types'

const emptyForm = {
  name: '',
  description: '',
  imageUrl: '',
  city: '',
  address: '',
  partner: false,
}

/** Gallery CRUD. */
export function GalleryManagement() {
  const { data: galleries } = useGalleries()
  const create = useCreateEntity<Gallery>('galleries')
  const update = useUpdateEntity<Gallery>('galleries')
  const remove = useDeleteEntity('galleries')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Gallery | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }
  const openEdit = (gallery: Gallery) => {
    setEditing(gallery)
    setForm({ ...gallery })
    setModalOpen(true)
  }
  const submit = () => {
    if (editing) update.mutate({ id: editing.id, body: form })
    else create.mutate(form)
    setModalOpen(false)
  }

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div>
      <AdminHeader
        title="Gestion des galeries"
        subtitle={`${galleries?.length ?? 0} galerie(s)`}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <Plus size={15} /> Nouvelle galerie
          </button>
        }
      />

      <DataTable
        rows={galleries ?? []}
        rowKey={(g) => g.id}
        columns={[
          {
            header: 'Image',
            render: (g) => <img src={g.imageUrl} alt={g.name} className="h-12 w-16 object-cover" />,
          },
          { header: 'Nom', render: (g) => <span className="font-medium">{g.name}</span> },
          { header: 'Ville', render: (g) => g.city },
          {
            header: 'Partenaire',
            render: (g) =>
              g.partner ? (
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">Oui</span>
              ) : (
                <span className="text-ink/40">Non</span>
              ),
          },
          {
            header: 'Actions',
            className: 'text-right',
            render: (g) => (
              <div className="flex justify-end gap-2">
                <button onClick={() => openEdit(g)} title="Modifier" className="rounded-full p-2 text-ink/60 hover:bg-ink/5">
                  <Pencil size={15} />
                </button>
                <button onClick={() => remove.mutate(g.id)} title="Supprimer" className="rounded-full p-2 text-red-500 hover:bg-red-50">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la galerie' : 'Nouvelle galerie'}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <FormField label="Nom">
            <input required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Ville">
            <input className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} />
          </FormField>
          <FormField label="Adresse">
            <input className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </FormField>
          <FormField label="Image (URL)">
            <input className={inputClass} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
          </FormField>
          <FormField label="Description">
            <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.partner}
              onChange={(e) => set('partner', e.target.checked)}
              className="accent-gold"
            />
            Galerie partenaire
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-ink py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            {editing ? 'Enregistrer' : 'Créer la galerie'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
