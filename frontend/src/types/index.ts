export interface Artist {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  journey: string;
  style: string;
  portraitUrl: string;
  nationality: string;
  birthYear?: number;
  website?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  artistId: string;
  artistName: string;
  category: string;
  technique: string;
  dimensions: string;
  year: number;
  price?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export interface Gallery {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  isPartner: boolean;
  createdAt: string;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  startDate: string;
  endDate: string;
  location: string;
  galleryId: string;
  galleryName: string;
  artistIds: string[];
  artistNames: string[];
  artworkIds: string[];
  isFeatured: boolean;
  capacity: number;
  price: number;
  createdAt: string;
}

export interface Reservation {
  id: string;
  exhibitionId: string;
  exhibitionTitle: string;
  userId: string;
  userName: string;
  email: string;
  date: string;
  time: string;
  visitors: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  qrCode?: string;
  totalPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'visitor' | 'admin' | 'gallery_manager' | 'artist';
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Analytics {
  totalVisitors: number;
  totalArtworks: number;
  totalArtists: number;
  totalExhibitions: number;
  totalReservations: number;
  visitorTrend: { date: string; value: number }[];
  popularArtworks: { name: string; views: number }[];
  popularArtists: { name: string; views: number }[];
  reservationsByStatus: { status: string; count: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type FilterOption = {
  category?: string;
  technique?: string;
  year?: string;
  artist?: string;
  priceRange?: string;
  availability?: boolean;
};

export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'popular';
