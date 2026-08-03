import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Palette,
  Calendar,
  Building2,
  Ticket,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Artistes', href: '/admin/artists', icon: Users },
  { label: 'Œuvres', href: '/admin/artworks', icon: Palette },
  { label: 'Expositions', href: '/admin/exhibitions', icon: Calendar },
  { label: 'Galeries', href: '/admin/galleries', icon: Building2 },
  { label: 'Réservations', href: '/admin/reservations', icon: Ticket },
  { label: 'Utilisateurs', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex">
      <motion.aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen bg-obsidian text-ivory transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-20',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center justify-between px-6 border-b border-ivory/10">
            <Link to="/" className={cn('font-serif text-xl font-semibold', !isSidebarOpen && 'lg:hidden')}>
              Zoro<span className="text-gold">-</span>Zipa
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block text-ivory/60 hover:text-ivory"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-ivory/60 hover:text-ivory">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                    isActive ? 'bg-gold text-obsidian' : 'text-ivory/70 hover:bg-ivory/5 hover:text-ivory',
                    !isSidebarOpen && 'lg:justify-center'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className={cn('text-sm font-medium', !isSidebarOpen && 'lg:hidden')}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-ivory/10">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-ivory/70 hover:bg-ivory/5 hover:text-ivory transition-colors',
                !isSidebarOpen && 'lg:justify-center'
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={cn('text-sm font-medium', !isSidebarOpen && 'lg:hidden')}>Retour au site</span>
            </Link>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden h-16 bg-obsidian text-ivory flex items-center justify-between px-6 sticky top-0 z-30">
          <span className="font-serif text-lg">Admin</span>
          <button onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </div>

      {isMobileOpen && <div className="fixed inset-0 bg-obsidian/50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
    </div>
  );
}
