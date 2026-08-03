import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  extraActions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({ columns, data, onEdit, onDelete, extraActions }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-obsidian/5 bg-ivory shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-cream/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-medium">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete || extraActions) && <th className="px-6 py-4" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-obsidian/5">
          {data.map((item, i) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="hover:bg-cream/30 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-obsidian">
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
              {(onEdit || onDelete || extraActions) && (
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {extraActions?.(item)}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
