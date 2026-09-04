import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Command, Heart, Menu, Search, X, ChevronDown } from 'lucide-react'
import { useFavorites } from '../store/favorites'
import { useQuickSearch } from '../store/quickSearch'

const mainLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
]

const explorationLinks = [
  { to: '/galerie', label: 'Galerie' },
  { to: '/exhibition', label: 'Expositions' },
  { to: '/solo-show', label: 'Solo Show' },
  { to: '/media', label: 'Média' },
  { to: '/masterclass', label: 'Masterclass' },
]

const shopLink = { to: '/shop', label: 'Shop' }

/** Global navigation: transparent over the hero, solid ink once scrolled. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const location = useLocation()
  const favoritesCount = useFavorites((s) => s.ids.length)
  const openSearch = useQuickSearch((s) => s.setOpen)
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

        <nav className="hidden items-center gap-6 lg:flex">
          <button
            onClick={() => openSearch(true)}
            aria-label="Recherche rapide"
            className="flex items-center gap-2 rounded-full border border-ivory/20 px-3 py-1.5 text-xs text-ivory/60 transition-colors hover:border-gold hover:text-gold"
          >
            <Search size={13} />
            <Command size={11} />K
          </button>
          {mainLinks.map((l) => (
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

          {/* Dropdown Exploration */}
          <div className="relative">
            <button
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
              className="flex items-center gap-1 text-sm text-ivory/80 transition-colors hover:text-ivory"
            >
              Exploration <ChevronDown size={14} />
            </button>
            {exploreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onMouseEnter={() => setExploreOpen(true)}
                onMouseLeave={() => setExploreOpen(false)}
                className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-ink border border-gold/20 shadow-lg"
              >
                {explorationLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        isActive
                          ? 'bg-gold/20 text-gold'
                          : 'text-ivory/80 hover:bg-gold/10 hover:text-gold'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </div>

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
            to={shopLink.to}
            className="rounded-full border border-gold px-5 py-2 text-sm text-gold transition-all hover:bg-gold hover:text-ink"
          >
            {shopLink.label}
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
              {mainLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `py-2 text-sm ${isActive ? 'text-gold' : 'text-ivory/80'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="py-2 text-xs uppercase tracking-widest text-gold/60">Exploration</div>
              {explorationLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `py-2 pl-4 text-sm ${isActive ? 'text-gold' : 'text-ivory/80'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink
                to="/favoris"
                className={({ isActive }) =>
                  `py-2 text-sm ${isActive ? 'text-gold' : 'text-ivory/80'}`
                }
              >
                Favoris
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `py-2 text-sm font-medium ${isActive ? 'text-gold' : 'text-ivory/80'}`
                }
              >
                Shop
              </NavLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}