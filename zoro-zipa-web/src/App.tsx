import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ClientLayout } from './layouts/ClientLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/client/HomePage'
import { ArtworkCatalogPage } from './pages/client/ArtworkCatalogPage'
import { ArtworkDetailPage } from './pages/client/ArtworkDetailPage'
import { ArtistListPage } from './pages/client/ArtistListPage'
import { ArtistProfilePage } from './pages/client/ArtistProfilePage'
import { ExhibitionListPage } from './pages/client/ExhibitionListPage'
import { ExhibitionDetailPage } from './pages/client/ExhibitionDetailPage'
import { GalleryPage } from './pages/client/GalleryPage'
import { ReservationPage } from './pages/client/ReservationPage'
import { FavoritesPage } from './pages/client/FavoritesPage'
import { VirtualTourPage } from './pages/client/VirtualTourPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ArtistManagement } from './pages/admin/ArtistManagement'
import { ArtworkManagement } from './pages/admin/ArtworkManagement'
import { GalleryManagement } from './pages/admin/GalleryManagement'
import { ExhibitionManagement } from './pages/admin/ExhibitionManagement'
import { ReservationManagement } from './pages/admin/ReservationManagement'
import { UserManagement } from './pages/admin/UserManagement'
import { AnalyticsPage } from './pages/admin/AnalyticsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/oeuvres" element={<ArtworkCatalogPage />} />
          <Route path="/oeuvres/:id" element={<ArtworkDetailPage />} />
          <Route path="/artistes" element={<ArtistListPage />} />
          <Route path="/artistes/:id" element={<ArtistProfilePage />} />
          <Route path="/expositions" element={<ExhibitionListPage />} />
          <Route path="/expositions/:id" element={<ExhibitionDetailPage />} />
          <Route path="/galeries" element={<GalleryPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="/visite-virtuelle" element={<VirtualTourPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="artistes" element={<ArtistManagement />} />
          <Route path="oeuvres" element={<ArtworkManagement />} />
          <Route path="galeries" element={<GalleryManagement />} />
          <Route path="expositions" element={<ExhibitionManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="utilisateurs" element={<UserManagement />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
