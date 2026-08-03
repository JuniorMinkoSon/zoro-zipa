import { useState } from 'react';
import { useArtists, useCreateArtist, useUpdateArtist, useDeleteArtist } from '../../hooks/useArtists';
import { DataTable } from '../../components/DataTable';
import { AdminHeader } from '../../components/AdminHeader';
import { Modal } from '../../components/Modal';
import { seedArtists } from '../../data/seed';
import type { Artist } from '../../types';
import { cn } from '../../utils/cn';

export function ArtistManagement() {
  const { data: artists = [] } = useArtists();
  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();
  const deleteArtist = useDeleteArtist();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [form, setForm] = useState<Partial<Artist>>({});

  const allArtists = artists.length > 0 ? artists : seedArtists;

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setIsModalOpen(true);
  };

  const openEdit = (artist: Artist) => {
    setEditing(artist);
    setForm(artist);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateArtist.mutateAsync({ id: editing.id, data: form });
    } else {
      await createArtist.mutateAsync(form as Omit<Artist, 'id' | 'createdAt'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (artist: Artist) => {
    if (confirm(`Supprimer ${artist.firstName} ${artist.lastName} ?`)) {
      await deleteArtist.mutateAsync(artist.id);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Gestion des artistes"
        description="Créer, modifier, supprimer et valider les profils artistes."
        onAdd={openCreate}
      />

      <DataTable
        columns={[
          {
            key: 'portraitUrl',
            header: 'Photo',
            render: (a) => <img src={a.portraitUrl} alt="" className="w-10 h-10 rounded-full object-cover" />,
          },
          {
            key: 'name',
            header: 'Nom',
            render: (a) => `${a.firstName} ${a.lastName}`,
          },
          { key: 'style', header: 'Style' },
          {
            key: 'isVerified',
            header: 'Statut',
            render: (a) => (
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  a.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                )}
              >
                {a.isVerified ? 'Vérifié' : 'En attente'}
              </span>
            ),
          },
        ]}
        data={allArtists}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Modifier un artiste' : 'Ajouter un artiste'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted block mb-1">Prénom</label>
              <input
                required
                value={form.firstName || ''}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Nom</label>
              <input
                required
                value={form.lastName || ''}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Biographie</label>
            <textarea
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Portrait URL</label>
            <input
              value={form.portraitUrl || ''}
              onChange={(e) => setForm({ ...form, portraitUrl: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted block mb-1">Nationalité</label>
              <input
                value={form.nationality || ''}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-1">Année de naissance</label>
              <input
                type="number"
                value={form.birthYear || ''}
                onChange={(e) => setForm({ ...form, birthYear: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Style</label>
            <input
              value={form.style || ''}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream rounded-lg border border-obsidian/10 focus:border-gold focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-obsidian">
            <input
              type="checkbox"
              checked={!!form.isVerified}
              onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
              className="w-4 h-4 accent-gold"
            />
            Artiste vérifié
          </label>
          <button type="submit" className="w-full py-3 bg-obsidian text-ivory rounded-full hover:bg-stone transition-colors">
            {editing ? 'Enregistrer' : 'Créer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
