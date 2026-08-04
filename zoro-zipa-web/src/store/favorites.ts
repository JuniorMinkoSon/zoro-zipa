import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: number[]
  toggle: (id: number) => void
  isFavorite: (id: number) => boolean
}

/** Favorite artworks, persisted in localStorage. */
export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
    }),
    { name: 'zoro-zipa-favorites' },
  ),
)
