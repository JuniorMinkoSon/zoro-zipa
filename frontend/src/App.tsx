import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AccessGate } from './components/AccessGate'
import { VisitorGate } from './components/VisitorGate'
import { ClientLayout } from './layouts/ClientLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/client/HomePage'
import { ArtworkCatalogPage } from './pages/client/ArtworkCatalogPage'
import { ArtworkDetailPage } from './pages/client/ArtworkDetailPage'
import { ArtistProfilePage } from './pages/client/ArtistProfilePage'
import { FavoritesPage } from './pages/client/FavoritesPage'
import { ExhibitionPage } from './pages/client/ExhibitionPage'
import { SoloShowPage } from './pages/client/SoloShowPage'
import { MediaPage } from './pages/client/MediaPage'
import { ShopPage } from './pages/client/ShopPage'
import { MasterclassPage } from './pages/client/MasterclassPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ArtistManagement } from './pages/admin/ArtistManagement'
import { GalleryManagement } from './pages/admin/GalleryManagement'
import { ArtworkManagement } from './pages/admin/ArtworkManagement'
import { ExhibitionManagement } from './pages/admin/ExhibitionManagement'
import { SoloShowManagement } from './pages/admin/SoloShowManagement'
import { MediaManagement } from './pages/admin/MediaManagement'
import { ProductManagement } from './pages/admin/ProductManagement'
import { MasterclassManagement } from './pages/admin/MasterclassManagement'
import { ReservationManagement } from './pages/admin/ReservationManagement'
import { UserManagement } from './pages/admin/UserManagement'
import { VisitorManagement } from './pages/admin/VisitorManagement'
import { OrderManagement } from './pages/admin/OrderManagement'
import { AnalyticsPage } from './pages/admin/AnalyticsPage'
import { ProfileManagement } from './pages/admin/ProfileManagement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site: visitors only identify themselves (name + phone) — no account */}
        <Route element={<VisitorGate><ClientLayout /></VisitorGate>}>
          {/* Client Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/a-propos" element={<ArtistProfilePage />} />
          <Route path="/favoris" element={<FavoritesPage />} />

          {/* Exploration Section */}
          <Route path="/galerie" element={<ArtworkCatalogPage />} />
          <Route path="/oeuvres/:id" element={<ArtworkDetailPage />} />
          <Route path="/exhibition" element={<ExhibitionPage />} />
          <Route path="/solo-show" element={<SoloShowPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/masterclass" element={<MasterclassPage />} />

          {/* Shop */}
          <Route path="/shop" element={<ShopPage />} />
        </Route>

        {/* Admin panel: the only place where signing in still exists */}
        <Route path="/admin" element={<AccessGate><AdminLayout /></AccessGate>}>
          <Route index element={<AdminDashboard />} />
          <Route path="profil" element={<ProfileManagement />} />

          {/* Team & Content Management */}
          <Route path="artists" element={<ArtistManagement />} />
          <Route path="galleries" element={<GalleryManagement />} />
          <Route path="oeuvres" element={<ArtworkManagement />} />
          <Route path="exhibitions" element={<ExhibitionManagement />} />
          <Route path="solo-shows" element={<SoloShowManagement />} />
          <Route path="media" element={<MediaManagement />} />
          <Route path="masterclass" element={<MasterclassManagement />} />

          {/* Shop & Orders */}
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="visitors" element={<VisitorManagement />} />

          {/* Analytics */}
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Unknown URL: send the visitor home instead of rendering nothing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
