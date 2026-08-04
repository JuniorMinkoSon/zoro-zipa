import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Building2,
  CalendarCheck,
  Image,
  LayoutDashboard,
  Menu,
  Palette,
  Ticket,
  Users,
  X,
} from 'lucide-react'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/artistes', label: 'Artistes', icon: Palette },
  { to: '/admin/oeuvres', label: 'Œuvres', icon: Image },
  { to: '/admin/galeries', label: 'Galeries', icon: Building2 },
  { to: '/admin/expositions', label: 'Expositions', icon: CalendarCheck },
  { to: '/admin/reservations', label: 'Réservations', icon: Ticket },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink py-6 lg:flex">
        <Link to="/" className="mb-8 px-6 font-display text-2xl text-ivory">
          Zoro<span className="text-gold">·</span>Zipa
          <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-ivory/40">
            Administration
          </span>
        </Link>
        {nav}
        <Link
          to="/"
          className="mt-auto px-7 text-xs text-ivory/40 transition-colors hover:text-gold"
        >
          ← Retour au site
        </Link>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 bg-ink py-6">
            <div className="mb-6 flex items-center justify-between px-6">
              <span className="font-display text-xl text-ivory">Admin</span>
              <button onClick={() => setOpen(false)} className="text-ivory" aria-label="Fermer le menu">
                <X size={20} />
              </button>
            </div>
            {nav}
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
