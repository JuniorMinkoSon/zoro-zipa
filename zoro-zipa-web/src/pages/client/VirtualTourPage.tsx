import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { useArtworks } from '../../api/hooks'

/**
 * Virtual gallery mode: one artwork at a time on a dark museum wall,
 * with next/previous navigation and a contextual info panel.
 */
export function VirtualTourPage() {
  const { data: artworks, isLoading } = useArtworks()
  const [index, setIndex] = useState(0)
  const [infoOpen, setInfoOpen] = useState(true)

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-ink text-ivory/50">
        Préparation de la galerie…
      </div>
    )
  if (!artworks?.length)
    return (
      <div className="flex h-screen items-center justify-center bg-ink text-ivory/50">
        Aucune œuvre disponible.
      </div>
    )

  const artwork = artworks[index]
  const prev = () => setIndex((i) => (i - 1 + artworks.length) % artworks.length)
  const next = () => setIndex((i) => (i + 1) % artworks.length)

  return (
    <div className="relative flex min-h-screen flex-col bg-ink pt-20">
      <div className="relative flex flex-1 items-center justify-center px-6 py-10">
        {/* Wall lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.12),transparent_60%)]" />

        <button
          onClick={prev}
          aria-label="Œuvre précédente"
          className="absolute left-4 z-10 rounded-full border border-ivory/20 p-3 text-ivory transition-colors hover:border-gold hover:text-gold md:left-10"
        >
          <ChevronLeft size={20} />
        </button>

        <AnimatePresence mode="wait">
          <motion.figure
            key={artwork.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto max-h-[60vh] border-[12px] border-[#2a2118] shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-h-[calc(60vh-24px)] w-auto object-contain"
              />
            </div>
            <figcaption className="mt-6 text-ivory">
              <p className="font-display text-2xl">{artwork.title}</p>
              <p className="mt-1 text-sm text-gold">
                {artwork.artistName} · {artwork.year}
              </p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <button
          onClick={next}
          aria-label="Œuvre suivante"
          className="absolute right-4 z-10 rounded-full border border-ivory/20 p-3 text-ivory transition-colors hover:border-gold hover:text-gold md:right-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-ivory/40">
            Œuvre {index + 1} / {artworks.length}
          </p>
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gold"
          >
            <Info size={14} /> {infoOpen ? 'Masquer' : 'Informations'}
          </button>
        </div>
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-ivory/10 bg-ink-soft p-5 text-sm leading-relaxed text-ivory/70">
                {artwork.description}
                <Link
                  to={`/oeuvres/${artwork.id}`}
                  className="mt-3 block text-gold underline-offset-4 hover:underline"
                >
                  Voir la fiche complète →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
