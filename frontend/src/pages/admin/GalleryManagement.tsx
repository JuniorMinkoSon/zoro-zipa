import { useState } from 'react';
import { useGalleries, useCreateGallery, useUpdateGallery, useDeleteGallery } from '../../hooks/useGalleries';
import { DataTable } from '../../components/DataTable';
import { AdminHeader } from '../../components/AdminHeader';
import { Modal } from '../../components/Modal';
import { seedGalleries } from '../../data/seed';
import type { Gallery } from '../../types';

export function GalleryManagement() {
  const { data: galleries = [] } = useGalleries();
  const createGallery = useCreateGallery();
  const updateGallery = useUpdateGallery();
  const deleteGallery = useDeleteGallery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [form, setForm] = useState<Partial<Gallery>>({});

  const allGalleries = galleries.length > 0 ? galleries : seedGalleries;

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setIsModalOpen(true);
  };

  const openEdit = (gallery: Gallery) => {
    setEditing(gallery);
    setForm(gallery);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateGallery.mutateAsync({ id: editing.id, data: form });
    } else {
      await createGallery.mutateAsync(form as Omit<Gallery, 'id' | 'createdAt'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (gallery: Gallery) => {
    if (confirm(`Supprimer ${gallery.name} ?`)) {
      await deleteGallery.mutateAsync(gallery.id);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Gestion des galeries"
        description="Gérez les galeries partenaires et leurs informations."
        onAdd={openCreate}
      />

      <DataTable
        columns={[
          {
            key: 'imageUrl',
            header: 'Image',
            render: (g) => <img src={g.imageUrl} alt={g.name} className="w-12 h-12 rounded-lg object-cover" />,
          },
          { key: 'name', header: 'Nom' },
          { key: 'city', header: 'Ville' },
          { key: 'country', header: 'Pays' },
        ]}
        data={allGalleries}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Modifier une galerie' : 'Ajouter une galerie'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted block mb-1">Nom</label>
            <input
              required
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              <label className="text-sm text-muted block mb-1">Ville</label>
              <input
                value={form.city || ''}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Pays</label>
              <input
                value={form.country || ''}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Adresse</label>
            <input
              value={form.address || ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Image URL</label>
            <input
              value={form.imageUrl || ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-3 w-full h-40 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Site web</label>
            <input
              value={form.website || ''}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
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
