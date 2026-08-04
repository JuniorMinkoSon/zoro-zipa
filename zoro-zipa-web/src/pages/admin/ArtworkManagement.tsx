import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormField, inputClass } from '../../components/admin/FormField'
import { Modal } from '../../components/Modal'
import {
  useArtists,
  useArtworks,
  useCreateEntity,
  useDeleteEntity,
  useUpdateEntity,
} from '../../api/hooks'
import type { Artwork } from '../../types'

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  artistId: 0,
  category: '',
  technique: '',
  dimensions: '',
  year: new Date().getFullYear(),
  trending: false,
}

/** Full artwork CRUD with live image preview. */
export function ArtworkManagement() {
  const { data: artworks } = useArtworks()
  const { data: artists } = useArtists()
  const create = useCreateEntity<Artwork>('artworks')
  const update = useUpdateEntity<Artwork>('artworks')
  const remove = useDeleteEntity('artworks')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Artwork | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, artistId: artists?.[0]?.id ?? 0 })
    setModalOpen(true)
  }
  const openEdit = (artwork: Artwork) => {
    setEditing(artwork)
    setForm({ ...artwork })
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
        title="Gestion des œuvres"
        subtitle={`${artworks?.length ?? 0} œuvre(s)`}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <Plus size={15} /> Nouvelle œuvre
          </button>
        }
      />

      <DataTable
        rows={artworks ?? []}
        rowKey={(a) => a.id}
        columns={[
          {
            header: 'Image',
            render: (a) => <img src={a.imageUrl} alt={a.title} className="h-12 w-12 object-cover" />,
          },
          { header: 'Titre', render: (a) => <span className="font-medium">{a.title}</span> },
          { header: 'Artiste', render: (a) => a.artistName },
          { header: 'Catégorie', render: (a) => a.category },
          { header: 'Technique', render: (a) => a.technique },
          { header: 'Année', render: (a) => a.year },
          {
            header: 'Actions',
            className: 'text-right',
            render: (a) => (
              <div className="flex justify-end gap-2">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier l’œuvre' : 'Nouvelle œuvre'} wide>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <FormField label="Titre">
            <input required className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} />
          </FormField>
          <FormField label="Artiste">
            <select
              className={inputClass}
              value={form.artistId}
              onChange={(e) => set('artistId', Number(e.target.value))}
            >
              {artists?.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Catégorie">
            <input className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)} />
          </FormField>
          <FormField label="Technique">
            <input className={inputClass} value={form.technique} onChange={(e) => set('technique', e.target.value)} />
          </FormField>
          <FormField label="Dimensions">
            <input className={inputClass} placeholder="120 × 90 cm" value={form.dimensions} onChange={(e) => set('dimensions', e.target.value)} />
          </FormField>
          <FormField label="Année">
            <input
              type="number"
              className={inputClass}
              value={form.year}
              onChange={(e) => set('year', Number(e.target.value))}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Image (URL)">
              <input className={inputClass} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
            </FormField>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Aperçu"
                className="mt-3 h-40 w-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            )}
          </div>
          <div className="md:col-span-2">
            <FormField label="Description">
              <textarea rows={4} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={form.trending}
              onChange={(e) => set('trending', e.target.checked)}
              className="accent-gold"
            />
            Mettre en avant (œuvre tendance)
          </label>
          <button
            type="submit"
            className="rounded-full bg-ink px-8 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink md:col-span-2"
          >
            {editing ? 'Enregistrer' : 'Créer l’œuvre'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
