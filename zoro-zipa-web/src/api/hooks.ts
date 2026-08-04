import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  Artist,
  Artwork,
  Exhibition,
  Gallery,
  Reservation,
  ReservationRequest,
  Stats,
  User,
} from '../types'

/** Centralized data layer: React Query hooks over the Spring Boot REST API. */

const fetchList = <T,>(url: string) => async (): Promise<T[]> =>
  (await api.get<T[]>(url)).data

const fetchOne = <T,>(url: string) => async (): Promise<T> =>
  (await api.get<T>(url)).data

// ---------- Artists ----------
export const useArtists = () =>
  useQuery({ queryKey: ['artists'], queryFn: fetchList<Artist>('/artists') })

export const useArtist = (id: number | undefined) =>
  useQuery({
    queryKey: ['artists', id],
    queryFn: fetchOne<Artist>(`/artists/${id}`),
    enabled: id !== undefined,
  })

// ---------- Artworks ----------
export const useArtworks = () =>
  useQuery({ queryKey: ['artworks'], queryFn: fetchList<Artwork>('/artworks') })

export const useArtwork = (id: number | undefined) =>
  useQuery({
    queryKey: ['artworks', id],
    queryFn: fetchOne<Artwork>(`/artworks/${id}`),
    enabled: id !== undefined,
  })

// ---------- Galleries ----------
export const useGalleries = () =>
  useQuery({ queryKey: ['galleries'], queryFn: fetchList<Gallery>('/galleries') })

// ---------- Exhibitions ----------
export const useExhibitions = () =>
  useQuery({
    queryKey: ['exhibitions'],
    queryFn: fetchList<Exhibition>('/exhibitions'),
  })

export const useExhibition = (id: number | undefined) =>
  useQuery({
    queryKey: ['exhibitions', id],
    queryFn: fetchOne<Exhibition>(`/exhibitions/${id}`),
    enabled: id !== undefined,
  })

// ---------- Reservations ----------
export const useReservations = () =>
  useQuery({
    queryKey: ['reservations'],
    queryFn: fetchList<Reservation>('/reservations'),
  })

export const useCreateReservation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: ReservationRequest) =>
      (await api.post<Reservation>('/reservations', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })
}

// ---------- Users ----------
export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: fetchList<User>('/users') })

// ---------- Stats ----------
export const useStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: fetchOne<Stats>('/stats') })

// ---------- Generic admin CRUD ----------
type Resource =
  | 'artists'
  | 'artworks'
  | 'galleries'
  | 'exhibitions'
  | 'reservations'
  | 'users'

export const useCreateEntity = <T,>(resource: Resource) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<T>) =>
      (await api.post<T>(`/${resource}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  })
}

export const useUpdateEntity = <T,>(resource: Resource) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<T> }) =>
      (await api.put<T>(`/${resource}/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  })
}

export const useDeleteEntity = (resource: Resource) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/${resource}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
  })
}
