import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, X } from 'lucide-react'
import { useFavorites } from '../store/favorites'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/oeuvres', label: 'Œuvres' },
  { to: '/artistes', label: 'Artistes' },
  { to: '/expositions', label: 'Expositions' },
  { to: '/galeries', label: 'Galeries' },
  { to: '/visite-virtuelle', label: 'Visite virtuelle' },
]

/** Global navigation: transparent over the hero, solid ink once scrolled. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const favoritesCount = useFavorites((s) => s.ids.length)
  const transparent = location.pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        transparent ? 'bg-transparent py-5' : 'bg-ink/95 py-3 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-2xl tracking-wide text-ivory">
          Zoro<span className="text-gold">·</span>Zipa
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? 'text-gold' : 'text-ivory/80 hover:text-ivory'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/favoris"
            className="relative text-ivory/80 transition-colors hover:text-gold"
            aria-label="Favoris"
          >
            <Heart size={18} />
            {favoritesCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link
            to="/reservation"
            className="rounded-full border border-gold px-5 py-2 text-sm text-gold transition-all hover:bg-gold hover:text-ink"
          >
            Réserver
          </Link>
        </nav>

        <button
          className="text-ivory lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-ink lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {[...links, { to: '/favoris', label: 'Favoris' }, { to: '/reservation', label: 'Réserver une visite' }].map(
                (l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `py-2 text-sm ${isActive ? 'text-gold' : 'text-ivory/80'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ),
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
