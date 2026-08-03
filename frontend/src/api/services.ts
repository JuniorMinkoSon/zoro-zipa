import { apiClient } from './axios';
import type {
  Artist,
  Artwork,
  Exhibition,
  Gallery,
  Reservation,
  User,
  Analytics,
} from '../types';

export const artistService = {
  getAll: () => apiClient.get<Artist[]>('/artists').then((res) => res.data),
  getById: (id: string) => apiClient.get<Artist>(`/artists/${id}`).then((res) => res.data),
  create: (data: Omit<Artist, 'id' | 'createdAt'>) => apiClient.post<Artist>('/artists', data).then((res) => res.data),
  update: (id: string, data: Partial<Artist>) => apiClient.put<Artist>(`/artists/${id}`, data).then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/artists/${id}`),
  validate: (id: string, isVerified: boolean) => apiClient.patch(`/artists/${id}/validate`, { isVerified }).then((res) => res.data),
};

export const artworkService = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    apiClient.get<Artwork[]>('/artworks', { params }).then((res) => res.data),
  getById: (id: string) => apiClient.get<Artwork>(`/artworks/${id}`).then((res) => res.data),
  create: (data: Omit<Artwork, 'id' | 'createdAt'>) => apiClient.post<Artwork>('/artworks', data).then((res) => res.data),
  update: (id: string, data: Partial<Artwork>) => apiClient.put<Artwork>(`/artworks/${id}`, data).then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/artworks/${id}`),
  getFeatured: () => apiClient.get<Artwork[]>('/artworks/featured').then((res) => res.data),
  getTrending: () => apiClient.get<Artwork[]>('/artworks/trending').then((res) => res.data),
};

export const exhibitionService = {
  getAll: () => apiClient.get<Exhibition[]>('/exhibitions').then((res) => res.data),
  getById: (id: string) => apiClient.get<Exhibition>(`/exhibitions/${id}`).then((res) => res.data),
  create: (data: Omit<Exhibition, 'id' | 'createdAt'>) => apiClient.post<Exhibition>('/exhibitions', data).then((res) => res.data),
  update: (id: string, data: Partial<Exhibition>) => apiClient.put<Exhibition>(`/exhibitions/${id}`, data).then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/exhibitions/${id}`),
  getCurrent: () => apiClient.get<Exhibition[]>('/exhibitions/current').then((res) => res.data),
};

export const galleryService = {
  getAll: () => apiClient.get<Gallery[]>('/galleries').then((res) => res.data),
  getById: (id: string) => apiClient.get<Gallery>(`/galleries/${id}`).then((res) => res.data),
  create: (data: Omit<Gallery, 'id' | 'createdAt'>) => apiClient.post<Gallery>('/galleries', data).then((res) => res.data),
  update: (id: string, data: Partial<Gallery>) => apiClient.put<Gallery>(`/galleries/${id}`, data).then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/galleries/${id}`),
  getPartners: () => apiClient.get<Gallery[]>('/galleries/partners').then((res) => res.data),
};

export const reservationService = {
  getAll: () => apiClient.get<Reservation[]>('/reservations').then((res) => res.data),
  getById: (id: string) => apiClient.get<Reservation>(`/reservations/${id}`).then((res) => res.data),
  create: (data: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'qrCode'>) =>
    apiClient.post<Reservation>('/reservations', data).then((res) => res.data),
  update: (id: string, data: Partial<Reservation>) => apiClient.put<Reservation>(`/reservations/${id}`, data).then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/reservations/${id}`),
  getMyReservations: () => apiClient.get<Reservation[]>('/reservations/my').then((res) => res.data),
};

export const userService = {
  getAll: () => apiClient.get<User[]>('/users').then((res) => res.data),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`).then((res) => res.data),
  update: (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data).then((res) => res.data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

export const analyticsService = {
  getDashboard: () => apiClient.get<Analytics>('/analytics/dashboard').then((res) => res.data),
  getVisitors: (from?: string, to?: string) =>
    apiClient.get('/analytics/visitors', { params: { from, to } }).then((res) => res.data),
};

export const aiService = {
  ask: (question: string, context?: string) =>
    apiClient.post<{ answer: string }>('/ai/ask', { question, context }).then((res) => res.data),
};
