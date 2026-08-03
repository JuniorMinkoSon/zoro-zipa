import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ArtworkCatalogPage } from './pages/ArtworkCatalogPage';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistProfilePage } from './pages/ArtistProfilePage';
import { ExhibitionListPage } from './pages/ExhibitionListPage';
import { ExhibitionDetailPage } from './pages/ExhibitionDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReservationPage } from './pages/ReservationPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ArtistManagement } from './pages/admin/ArtistManagement';
import { ArtworkManagement } from './pages/admin/ArtworkManagement';
import { ExhibitionManagement } from './pages/admin/ExhibitionManagement';
import { GalleryManagement } from './pages/admin/GalleryManagement';
import { ReservationManagement } from './pages/admin/ReservationManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="artworks" element={<ArtworkCatalogPage />} />
        <Route path="artworks/:id" element={<ArtworkDetailPage />} />
        <Route path="artists" element={<ArtistsPage />} />
        <Route path="artists/:id" element={<ArtistProfilePage />} />
        <Route path="exhibitions" element={<ExhibitionListPage />} />
        <Route path="exhibitions/:id" element={<ExhibitionDetailPage />} />
        <Route path="galleries" element={<GalleryPage />} />
        <Route path="reservations" element={<ReservationPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="artists" element={<ArtistManagement />} />
        <Route path="artworks" element={<ArtworkManagement />} />
        <Route path="exhibitions" element={<ExhibitionManagement />} />
        <Route path="galleries" element={<GalleryManagement />} />
        <Route path="reservations" element={<ReservationManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
