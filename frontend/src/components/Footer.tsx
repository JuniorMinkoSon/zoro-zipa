import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Globe, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-obsidian text-ivory/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-semibold text-ivory">
              Zoro<span className="text-gold">-</span>Zipa
            </Link>
            <p className="text-sm leading-relaxed text-ivory/60">
              Plateforme digitale dédiée à l'art contemporain et aux expositions. Découvrez, explorez et réservez une expérience culturelle unique.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-ivory/60 hover:text-gold transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory mb-6">Explorer</h4>
            <ul className="space-y-3">
              {[
                { label: 'Œuvres', href: '/artworks' },
                { label: 'Artistes', href: '/artists' },
                { label: 'Expositions', href: '/exhibitions' },
                { label: 'Galeries', href: '/galleries' },
                { label: 'Réservations', href: '/reservations' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-ivory/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory mb-6">Informations</h4>
            <ul className="space-y-3">
              {['À propos', 'Contact', 'Mentions légales', 'Politique de confidentialité', 'CGV'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-ivory/60 hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-ivory mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-ivory/60">
                <MapPin className="w-5 h-5 text-gold shrink-0" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ivory/60">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span>contact@zoro-zipa.art</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ivory/60">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <span>+225 00 00 00 00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} Zoro-Zipa. Tous droits réservés.
          </p>
          <p className="text-xs text-ivory/40">
            Une expérience culturelle premium
          </p>
        </div>
      </div>
    </footer>
  );
}
