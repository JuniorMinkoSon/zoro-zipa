import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden bg-obsidian">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545989253-02cc26577f88?auto=format&fit=crop&w=2000&q=80"
          alt="Art contemporain"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 gradient-overlay" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-medium uppercase tracking-[0.2em]"
        >
          Art Contemporain & Expositions
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-ivory leading-[1.1] tracking-tight"
        >
          Explorez l'art, découvrez les histoires derrière chaque œuvre
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-base md:text-lg text-ivory/70 font-light leading-relaxed"
        >
          Zoro-Zipa vous ouvre les portes d'un musée numérique où artistes, galeries et expositions se rencontrent dans une expérience immersive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/artworks"
            className="group flex items-center gap-2 px-8 py-4 bg-gold text-obsidian font-medium rounded-full hover:bg-gold-light transition-colors duration-300"
          >
            Découvrir les œuvres
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/exhibitions"
            className="flex items-center gap-2 px-8 py-4 border border-ivory/30 text-ivory font-medium rounded-full hover:bg-ivory/10 transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            Explorer les expositions
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-ivory/40 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-gold rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
