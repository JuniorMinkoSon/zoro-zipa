import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormField, inputClass } from '../../components/admin/FormField'
import { Modal } from '../../components/Modal'
import { ExhibitionCalendar } from '../../components/ExhibitionCalendar'
import {
  useArtists,
  useCreateEntity,
  useDeleteEntity,
  useExhibitions,
  useGalleries,
  useUpdateEntity,
} from '../../api/hooks'
import type { Exhibition } from '../../types'
import { formatDateRange } from '../../utils/format'

const emptyForm = {
  title: '',
  description: '',
  posterUrl: '',
  startDate: '',
  endDate: '',
  location: '',
  galleryId: 0,
  artistIds: [] as number[],
}

/** Exhibition CRUD with gallery/artists selection and a planning calendar. */
export function ExhibitionManagement() {
  const { data: exhibitions } = useExhibitions()
  const { data: galleries } = useGalleries()
  const { data: artists } = useArtists()
  const create = useCreateEntity<Exhibition>('exhibitions')
  const update = useUpdateEntity<Exhibition>('exhibitions')
  const remove = useDeleteEntity('exhibitions')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Exhibition | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, galleryId: galleries?.[0]?.id ?? 0 })
    setModalOpen(true)
  }
  const openEdit = (exhibition: Exhibition) => {
    setEditing(exhibition)
    setForm({ ...exhibition })
    setModalOpen(true)
  }
  const submit = () => {
    if (editing) update.mutate({ id: editing.id, body: form })
    else create.mutate(form)
    setModalOpen(false)
  }

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleArtist = (id: number) =>
    set(
      'artistIds',
      form.artistIds.includes(id)
        ? form.artistIds.filter((x) => x !== id)
        : [...form.artistIds, id],
    )

  return (
    <div>
      <AdminHeader
        title="Gestion des expositions"
        subtitle={`${exhibitions?.length ?? 0} exposition(s)`}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <Plus size={15} /> Nouvelle exposition
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <DataTable
          rows={exhibitions ?? []}
          rowKey={(e) => e.id}
          columns={[
            {
              header: 'Affiche',
              render: (e) => <img src={e.posterUrl} alt={e.title} className="h-14 w-11 object-cover" />,
            },
            { header: 'Titre', render: (e) => <span className="font-medium">{e.title}</span> },
            { header: 'Dates', render: (e) => formatDateRange(e.startDate, e.endDate) },
            { header: 'Galerie', render: (e) => e.galleryName },
            {
              header: 'Statut',
              render: (e) =>
                e.current ? (
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">En cours</span>
                ) : (
                  <span className="text-ink/40">Programmée</span>
                ),
            },
            {
              header: 'Actions',
              className: 'text-right',
              render: (e) => (
                <div className="flex justify-end gap-2">
                  <button onClick={() => openEdit(e)} title="Modifier" className="rounded-full p-2 text-ink/60 hover:bg-ink/5">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove.mutate(e.id)} title="Supprimer" className="rounded-full p-2 text-red-500 hover:bg-red-50">
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
            },
          ]}
        />

        <div>
          <ExhibitionCalendar exhibitions={exhibitions ?? []} />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier l’exposition' : 'Nouvelle exposition'} wide>
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
          <FormField label="Galerie">
            <select
              className={inputClass}
              value={form.galleryId}
              onChange={(e) => set('galleryId', Number(e.target.value))}
            >
              {galleries?.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Date de début">
            <input type="date" required className={inputClass} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </FormField>
          <FormField label="Date de fin">
            <input type="date" required className={inputClass} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
          </FormField>
          <FormField label="Lieu">
            <input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} />
          </FormField>
          <FormField label="Affiche (URL)">
            <input className={inputClass} value={form.posterUrl} onChange={(e) => set('posterUrl', e.target.value)} />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Description">
              <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-ink/50">Artistes participants</p>
            <div className="flex flex-wrap gap-2">
              {artists?.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => toggleArtist(a.id)}
                  className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                    form.artistIds.includes(a.id)
                      ? 'bg-gold text-ink'
                      : 'border border-ink/15 text-ink/60 hover:border-gold'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-ink px-8 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink md:col-span-2"
          >
            {editing ? 'Enregistrer' : 'Créer l’exposition'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
