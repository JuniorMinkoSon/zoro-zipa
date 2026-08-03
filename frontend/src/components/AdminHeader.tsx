import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function AdminHeader({ title, description, onAdd, addLabel = 'Ajouter' }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-serif text-obsidian">{title}</h1>
        {description && <p className="text-muted mt-1">{description}</p>}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-obsidian text-ivory rounded-full text-sm font-medium hover:bg-stone transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
