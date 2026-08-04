import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=2400&auto=format&fit=crop'

/** Full-screen immersive hero with a light parallax on scroll. */
export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Galerie d'art contemporain"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-xs uppercase tracking-[0.5em] text-gold"
        >
          Zoro-Zipa — Plateforme d'art contemporain
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-4xl font-display text-4xl leading-tight text-ivory md:text-6xl lg:text-7xl"
        >
          Explorez l'art, découvrez les histoires derrière chaque œuvre.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            to="/oeuvres"
            className="group flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-ink transition-all hover:bg-gold-soft"
          >
            Découvrir les œuvres
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/expositions"
            className="rounded-full border border-ivory/40 px-8 py-3.5 text-sm text-ivory transition-all hover:border-gold hover:text-gold"
          >
            Explorer les expositions
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  )
}
