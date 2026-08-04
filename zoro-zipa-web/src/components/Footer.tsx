import { Link } from 'react-router-dom'
import { AtSign, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">
            Zoro<span className="text-gold">·</span>Zipa
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/60">
            Explorez l'art, découvrez les histoires derrière chaque œuvre. Une
            plateforme dédiée à l'art contemporain, aux artistes et aux
            expositions.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            Découvrir
          </p>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/oeuvres" className="hover:text-gold">Œuvres</Link></li>
            <li><Link to="/artistes" className="hover:text-gold">Artistes</Link></li>
            <li><Link to="/expositions" className="hover:text-gold">Expositions</Link></li>
            <li><Link to="/galeries" className="hover:text-gold">Galeries</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            Contact
          </p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold" /> contact@zorozipa.art
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-gold" /> Abidjan, Côte d'Ivoire
            </li>
            <li className="flex items-center gap-2">
              <AtSign size={14} className="text-gold" /> @zorozipa
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} Zoro-Zipa — L'art contemporain, autrement.
      </div>
    </footer>
  )
}
