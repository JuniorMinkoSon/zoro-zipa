import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
}

/** Centered modal with backdrop blur and spring entrance. */
export function Modal({ open, onClose, title, children, wide = false }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[90vh] w-full overflow-y-auto bg-ivory p-6 shadow-2xl md:p-8 ${
              wide ? 'max-w-3xl' : 'max-w-lg'
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              {title && <h3 className="font-display text-2xl">{title}</h3>}
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="ml-auto rounded-full p-2 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
