import { useState } from 'react';
import { useArtworks, useCreateArtwork, useUpdateArtwork, useDeleteArtwork } from '../../hooks/useArtworks';
import { useArtists } from '../../hooks/useArtists';
import { DataTable } from '../../components/DataTable';
import { AdminHeader } from '../../components/AdminHeader';
import { Modal } from '../../components/Modal';
import { seedArtworks } from '../../data/seed';
import type { Artwork } from '../../types';

export function ArtworkManagement() {
  const { data: artworks = [] } = useArtworks();
  const { data: artists = [] } = useArtists();
  const createArtwork = useCreateArtwork();
  const updateArtwork = useUpdateArtwork();
  const deleteArtwork = useDeleteArtwork();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [form, setForm] = useState<Partial<Artwork>>({});

  const allArtworks = artworks.length > 0 ? artworks : seedArtworks;

  const openCreate = () => {
    setEditing(null);
    setForm({ galleryImages: [] });
    setIsModalOpen(true);
  };

  const openEdit = (artwork: Artwork) => {
    setEditing(artwork);
    setForm(artwork);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedArtist = artists.find((a) => `${a.firstName} ${a.lastName}` === form.artistName) || artists[0];
    const payload = {
      ...form,
      artistId: selectedArtist?.id || '',
      artistName: selectedArtist ? `${selectedArtist.firstName} ${selectedArtist.lastName}` : form.artistName || '',
    };
    if (editing) {
      await updateArtwork.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createArtwork.mutateAsync(payload as Omit<Artwork, 'id' | 'createdAt'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (artwork: Artwork) => {
    if (confirm(`Supprimer ${artwork.title} ?`)) {
      await deleteArtwork.mutateAsync(artwork.id);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Gestion des œuvres"
        description="CRUD complet des œuvres avec upload image et preview."
        onAdd={openCreate}
      />

      <DataTable
        columns={[
          {
            key: 'imageUrl',
            header: 'Image',
            render: (w) => <img src={w.imageUrl} alt={w.title} className="w-12 h-12 rounded-lg object-cover" />,
          },
          { key: 'title', header: 'Titre' },
          { key: 'artistName', header: 'Artiste' },
          { key: 'category', header: 'Catégorie' },
          { key: 'technique', header: 'Technique' },
          { key: 'year', header: 'Année' },
        ]}
        data={allArtworks}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Modifier une œuvre' : 'Ajouter une œuvre'}>
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
              <label className="text-sm text-muted block mb-1">Artiste</label>
              <select
                value={form.artistName || ''}
                onChange={(e) => setForm({ ...form, artistName: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              >
                <option value="">Sélectionner</option>
                {artists.map((a) => (
                  <option key={a.id} value={`${a.firstName} ${a.lastName}`}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Catégorie</label>
              <input
                value={form.category || ''}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted block mb-1">Technique</label>
              <input
                value={form.technique || ''}
                onChange={(e) => setForm({ ...form, technique: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Année</label>
              <input
                type="number"
                value={form.year || ''}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Image principale URL</label>
            <input
              value={form.imageUrl || ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-3 w-full h-40 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Dimensions</label>
            <input
              value={form.dimensions || ''}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-obsidian">
            <input
              type="checkbox"
              checked={!!form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="w-4 h-4 accent-gold"
            />
            Œuvre mise en avant
          </label>
          <button type="submit" className="w-full py-3 bg-obsidian text-ivory rounded-full hover:bg-stone transition-colors">
            {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
