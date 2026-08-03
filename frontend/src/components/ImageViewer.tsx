import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Modal } from './Modal';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) {
  const [current, setCurrent] = useState(initialIndex);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl bg-obsidian">
      <div className="relative flex items-center justify-center min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Vue ${current + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="max-h-[75vh] max-w-full object-contain rounded-lg"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-ivory/10 hover:bg-ivory/20 backdrop-blur-sm rounded-full text-ivory transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-ivory/10 hover:bg-ivory/20 backdrop-blur-sm rounded-full text-ivory transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <a
          href={images[current]}
          target="_blank"
          rel="noreferrer"
          className="absolute top-4 right-4 p-2 bg-ivory/10 hover:bg-ivory/20 backdrop-blur-sm rounded-full text-ivory transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </a>
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold w-6' : 'bg-ivory/30'}`}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}
