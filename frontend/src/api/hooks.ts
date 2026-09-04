import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  Artist,
  Artwork,
  Exhibition,
  SoloShow,
  Media,
  Product,
  Masterclass,
  Performance,
  PurchaseOrder,
  Gallery,
  Reservation,
  ReservationRequest,
  Stats,
  User,
} from '../types'
import { fetchCurrentVisitor, type Visitor } from './visitor'

/** Centralized data layer: React Query hooks over the Spring Boot REST API. */

const fetchList = <T,>(url: string) => async (): Promise<T[]> =>
  (await api.get<T[]>(url)).data

const fetchOne = <T,>(url: string) => async (): Promise<T> =>
  (await api.get<T>(url)).data

// ---------- Artists ----------
export const useArtists = () =>
  useQuery({
    queryKey: ['artists'],
    queryFn: fetchList<Artist>('/artists'),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  })

export const useArtist = (id: number | undefined) =>
  useQuery({
    queryKey: ['artists', id],
    queryFn: fetchOne<Artist>(`/artists/${id}`),
    enabled: id !== undefined,
  })

// ---------- Artworks ----------
export const useArtworks = () =>
  useQuery({
    queryKey: ['artworks'],
    queryFn: fetchList<Artwork>('/artworks'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

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
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
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

// ---------- Visitors (entry screen) ----------
/** The visitor behind the current session — what the entry screen collected. */
export const useCurrentVisitor = () =>
  useQuery({
    queryKey: ['visitor', 'me'],
    queryFn: fetchCurrentVisitor,
    staleTime: 5 * 60 * 1000,
  })

export const useVisitors = () =>
  useQuery({
    queryKey: ['visitors'],
    queryFn: fetchList<Visitor>('/visitors'),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })

// ---------- Stats ----------
export const useStats = () =>
  useQuery({
    queryKey: ['stats'],
    queryFn: fetchOne<Stats>('/stats'),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  })

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

// ---------- SoloShows ----------
export const useSoloShows = () =>
  useQuery({
    queryKey: ['solo-shows'],
    queryFn: fetchList<SoloShow>('/solo-shows'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

// ---------- Media ----------
export const useMedia = () =>
  useQuery({
    queryKey: ['media'],
    queryFn: fetchList<Media>('/media'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

// ---------- Products ----------
export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: fetchList<Product>('/products'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

// ---------- Masterclasses ----------
export const useMasterclasses = () =>
  useQuery({
    queryKey: ['masterclasses'],
    queryFn: fetchList<Masterclass>('/masterclasses'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

// ---------- Performances ----------
export const usePerformances = () =>
  useQuery({
    queryKey: ['performances'],
    queryFn: fetchList<Performance>('/performances'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

// ---------- Orders ----------
export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: fetchList<PurchaseOrder>('/orders'),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })
