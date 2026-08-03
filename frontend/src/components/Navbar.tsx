import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, Search } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { cn } from '../utils/cn';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Œuvres', href: '/artworks' },
  { label: 'Artistes', href: '/artists' },
  { label: 'Expositions', href: '/exhibitions' },
  { label: 'Galeries', href: '/galleries' },
];

export function Navbar() {
  const location = useLocation();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openAi } = useUIStore();
  const { favorites } = useFavoritesStore();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled || !isHome ? 'bg-ivory/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
            <span className={cn('text-2xl font-serif font-semibold tracking-tight', scrolled || !isHome ? 'text-obsidian' : 'text-ivory')}>
              Zoro<span className="text-gold">-</span>Zipa
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium tracking-wide transition-colors duration-300 hover:text-gold',
                    scrolled || !isHome ? (isActive ? 'text-gold' : 'text-obsidian/80') : 'text-ivory/90'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={openAi}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full border transition-all duration-300',
                scrolled || !isHome
                  ? 'border-obsidian/20 text-obsidian hover:border-gold hover:text-gold'
                  : 'border-ivory/30 text-ivory hover:border-gold hover:text-gold'
              )}
            >
              Zoro AI
            </button>
            <Link
              to="/artworks"
              className={cn(
                'p-2 rounded-full transition-colors',
                scrolled || !isHome ? 'text-obsidian hover:bg-obsidian/5' : 'text-ivory hover:bg-ivory/10'
              )}
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/favorites"
              className={cn(
                'relative p-2 rounded-full transition-colors',
                scrolled || !isHome ? 'text-obsidian hover:bg-obsidian/5' : 'text-ivory hover:bg-ivory/10'
              )}
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-ivory text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              className={cn(
                'p-2 rounded-full transition-colors',
                scrolled || !isHome ? 'text-obsidian hover:bg-obsidian/5' : 'text-ivory hover:bg-ivory/10'
              )}
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className={cn('lg:hidden p-2', scrolled || !isHome ? 'text-obsidian' : 'text-ivory')}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ivory border-t border-obsidian/10"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'block text-lg font-serif',
                    location.pathname === link.href ? 'text-gold' : 'text-obsidian'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    openAi();
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-full border border-obsidian/20 text-obsidian"
                >
                  Zoro AI
                </button>
                <Link to="/favorites" onClick={closeMobileMenu} className="flex items-center gap-2 text-obsidian">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Favoris ({favorites.length})</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
