import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

interface ImageViewerProps {
  images: string[]
  alt: string
}

/** HD image gallery: main view, thumbnails and a full-screen lightbox. */
export function ImageViewer({ images, alt }: ImageViewerProps) {
  const [index, setIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div>
      <div className="group relative overflow-hidden bg-ink">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="aspect-[4/5] w-full object-cover md:aspect-[3/4] lg:aspect-[4/5]"
          />
        </AnimatePresence>
        <button
          onClick={() => setFullscreen(true)}
          aria-label="Plein écran"
          className="absolute right-4 top-4 rounded-full bg-ink/50 p-2.5 text-ivory opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Maximize2 size={16} />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-2 text-ivory backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 p-2 text-ivory backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={`h-16 w-16 overflow-hidden transition-all ${
                i === index ? 'ring-2 ring-gold' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95"
            onClick={() => setFullscreen(false)}
          >
            <img
              src={images[index]}
              alt={alt}
              className="max-h-[92vh] max-w-[92vw] object-contain"
            />
            <button
              aria-label="Fermer"
              className="absolute right-6 top-6 rounded-full bg-ivory/10 p-3 text-ivory hover:bg-gold hover:text-ink"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
