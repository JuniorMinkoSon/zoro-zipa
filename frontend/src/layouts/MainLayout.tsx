import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ZoroAI } from '../components/ZoroAI';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ZoroAI />
    </div>
  );
}
