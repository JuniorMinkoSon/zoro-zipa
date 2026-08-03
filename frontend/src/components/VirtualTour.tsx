import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, MapPin, X } from 'lucide-react';
import type { Artwork } from '../types';

interface VirtualTourProps {
  artworks: Artwork[];
  isOpen: boolean;
  onClose: () => void;
}

export function VirtualTour({ artworks, isOpen, onClose }: VirtualTourProps) {
  const [current, setCurrent] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  const artwork = artworks[current] || artworks[0];
  if (!artwork) return null;

  const next = () => setCurrent((c) => (c + 1) % artworks.length);
  const prev = () => setCurrent((c) => (c - 1 + artworks.length) % artworks.length);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-obsidian"
      >
        <div className="absolute inset-0">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-obsidian/30" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-ivory/10 backdrop-blur-sm rounded-full text-ivory hover:bg-ivory/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="absolute inset-0 flex items-center justify-between px-6 z-10 pointer-events-none">
          <button
            onClick={prev}
            className="pointer-events-auto p-3 bg-ivory/10 backdrop-blur-sm rounded-full text-ivory hover:bg-ivory/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="pointer-events-auto p-3 bg-ivory/10 backdrop-blur-sm rounded-full text-ivory hover:bg-ivory/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-ivory/70 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Salle {current + 1} / {artworks.length}</span>
              </div>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-2 text-ivory/70 hover:text-ivory text-sm"
              >
                <Info className="w-4 h-4" />
                {showInfo ? 'Masquer' : 'Infos'}
              </button>
            </div>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-ivory/95 backdrop-blur-md rounded-2xl p-6"
                >
                  <h3 className="text-2xl font-serif text-obsidian">{artwork.title}</h3>
                  <p className="text-gold font-medium mt-1">{artwork.artistName}</p>
                  <p className="text-muted text-sm mt-2 line-clamp-3">{artwork.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                    <span className="px-2 py-1 bg-cream rounded">{artwork.technique}</span>
                    <span className="px-2 py-1 bg-cream rounded">{artwork.year}</span>
                    <span className="px-2 py-1 bg-cream rounded">{artwork.dimensions}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
