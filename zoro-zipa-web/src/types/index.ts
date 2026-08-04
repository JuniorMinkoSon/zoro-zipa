/** Domain types shared with the Spring Boot API. */

export type ArtistStatus = 'PENDING' | 'VALIDATED' | 'SUSPENDED'

export interface Artist {
  id: number
  name: string
  portraitUrl: string
  bio: string
  journey: string
  style: string
  nationality: string
  status: ArtistStatus
}

export interface Artwork {
  id: number
  title: string
  description: string
  imageUrl: string
  images: string[]
  artistId: number
  artistName: string
  category: string
  technique: string
  dimensions: string
  year: number
  trending: boolean
  views: number
}

export interface Gallery {
  id: number
  name: string
  description: string
  imageUrl: string
  city: string
  address: string
  partner: boolean
}

export interface Exhibition {
  id: number
  title: string
  description: string
  posterUrl: string
  startDate: string
  endDate: string
  location: string
  galleryId: number
  galleryName: string
  artistIds: number[]
  artistNames: string[]
  current: boolean
}

export type ReservationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED'

export interface Reservation {
  id: number
  exhibitionId: number
  exhibitionTitle: string
  visitDate: string
  timeSlot: string
  visitors: number
  fullName: string
  email: string
  status: ReservationStatus
  code: string
}

export interface ReservationRequest {
  exhibitionId: number
  visitDate: string
  timeSlot: string
  visitors: number
  fullName: string
  email: string
}

export type UserRole = 'ADMIN' | 'VISITOR' | 'GALLERY'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
}

export interface MonthlyPoint {
  month: string
  value: number
}

export interface PopularArtwork {
  title: string
  views: number
}

export interface Stats {
  artists: number
  artworks: number
  exhibitions: number
  visitors: number
  reservations: number
  visitorsByMonth: MonthlyPoint[]
  reservationsByMonth: MonthlyPoint[]
  popularArtworks: PopularArtwork[]
}
