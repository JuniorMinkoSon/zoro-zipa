import { useState } from 'react';
import { useExhibitions, useCreateExhibition, useUpdateExhibition, useDeleteExhibition } from '../../hooks/useExhibitions';
import { DataTable } from '../../components/DataTable';
import { AdminHeader } from '../../components/AdminHeader';
import { Modal } from '../../components/Modal';
import { seedExhibitions } from '../../data/seed';
import type { Exhibition } from '../../types';

export function ExhibitionManagement() {
  const { data: exhibitions = [] } = useExhibitions();
  const createExhibition = useCreateExhibition();
  const updateExhibition = useUpdateExhibition();
  const deleteExhibition = useDeleteExhibition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Exhibition | null>(null);
  const [form, setForm] = useState<Partial<Exhibition>>({});

  const allExhibitions = exhibitions.length > 0 ? exhibitions : seedExhibitions;

  const openCreate = () => {
    setEditing(null);
    setForm({ artistIds: [], artworkIds: [] });
    setIsModalOpen(true);
  };

  const openEdit = (exhibition: Exhibition) => {
    setEditing(exhibition);
    setForm(exhibition);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateExhibition.mutateAsync({ id: editing.id, data: form });
    } else {
      await createExhibition.mutateAsync(form as Omit<Exhibition, 'id' | 'createdAt'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (exhibition: Exhibition) => {
    if (confirm(`Supprimer ${exhibition.title} ?`)) {
      await deleteExhibition.mutateAsync(exhibition.id);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Gestion des expositions"
        description="Planifiez et gérez les expositions du musée."
        onAdd={openCreate}
      />

      <DataTable
        columns={[
          {
            key: 'posterUrl',
            header: 'Affiche',
            render: (e) => <img src={e.posterUrl} alt={e.title} className="w-14 h-10 rounded object-cover" />,
          },
          { key: 'title', header: 'Titre' },
          {
            key: 'dates',
            header: 'Dates',
            render: (e) => `${e.startDate} → ${e.endDate}`,
          },
          { key: 'location', header: 'Lieu' },
          { key: 'price', header: 'Tarif' },
        ]}
        data={allExhibitions}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Modifier une exposition' : 'Ajouter une exposition'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted block mb-1">Titre</label>
            <input
              required
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted block mb-1">Date début</label>
              <input
                type="date"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Date fin</label>
              <input
                type="date"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Lieu</label>
            <input
              value={form.location || ''}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted block mb-1">Capacité</label>
              <input
                type="number"
                value={form.capacity || ''}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Tarif (FCFA)</label>
              <input
                type="number"
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Affiche URL</label>
            <input
              value={form.posterUrl || ''}
              onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-obsidian text-ivory rounded-full hover:bg-stone transition-colors">
            {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
