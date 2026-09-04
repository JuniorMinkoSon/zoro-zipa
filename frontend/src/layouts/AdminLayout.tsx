import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  Users,
  X,
} from 'lucide-react'
import { logoutAdmin } from '../utils/auth'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profil', label: 'Mon Profil', icon: User },

  // Team & Content
  { to: '/admin/artists', label: 'Artistes', icon: Image },
  { to: '/admin/galleries', label: 'Galeries', icon: Image },
  { to: '/admin/oeuvres', label: 'Galerie', icon: Image },
  { to: '/admin/exhibitions', label: 'Expositions', icon: Image },
  { to: '/admin/solo-shows', label: 'Solo Shows', icon: Image },
  { to: '/admin/media', label: 'Média', icon: Image },
  { to: '/admin/masterclass', label: 'Masterclass', icon: Image },

  // Shop
  { to: '/admin/products', label: 'Produits', icon: ShoppingCart },
  { to: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
  { to: '/admin/reservations', label: 'Réservations', icon: ShoppingCart },
  { to: '/admin/users', label: 'Administrateurs', icon: User },

  // Audience
  { to: '/admin/visitors', label: 'Visiteurs', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

/** Back-office shell: dark cultural sidebar + light content area. */
export function AdminLayout() {
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-gold/15 text-gold'
                : 'text-ivory/60 hover:bg-ivory/5 hover:text-ivory'
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-ivory-dim">
      {/*
        Sidebar is a fixed-height column: logo and bottom actions stay put
        (shrink-0), while the nav list itself scrolls internally if it's
        taller than the viewport — so every link stays reachable, even on
        shorter screens (laptops, browser zoom, etc).
      */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink py-6 lg:flex">
        <Link to="/" className="mb-6 shrink-0 px-6 font-display text-2xl text-ivory">
          Zoro<span className="text-gold">·</span>Zipa
          <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-ivory/40">
            Administration
          </span>
        </Link>

        <div className="flex-1 overflow-y-auto">
          {nav}
        </div>

        <div className="mt-3 flex shrink-0 flex-col gap-3 border-t border-ivory/10 px-7 pt-4">
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-2 text-xs text-ivory/40 transition-colors hover:text-red-400"
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
          <Link
            to="/"
            className="text-xs text-ivory/40 transition-colors hover:text-gold"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="flex w-64 flex-col bg-ink py-6">
            <div className="mb-6 flex shrink-0 items-center justify-between px-6">
              <span className="font-display text-xl text-ivory">Admin</span>
              <button onClick={() => setOpen(false)} className="text-ivory" aria-label="Fermer le menu">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {nav}
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-ivory/10 px-7 pt-4">
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-2 text-xs text-ivory/40 transition-colors hover:text-red-400"
              >
                <LogOut size={14} />
                Se déconnecter
              </button>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="text-xs text-ivory/40 transition-colors hover:text-gold"
              >
                ← Retour au site
              </Link>
            </div>
          </div>
          <button
            className="flex-1 bg-ink/50"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="flex items-center gap-4 border-b border-ink/10 bg-white px-6 py-4 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={22} />
          </button>
          <span className="font-display text-lg">Administration</span>
        </header>
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}