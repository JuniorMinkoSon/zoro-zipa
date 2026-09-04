import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useCurrentVisitor } from '../../api/hooks'
import { useCartStore } from '../../stores/cartStore'
import type { CartItem } from '../../stores/cartStore'

interface CheckoutModalProps {
  items: CartItem[]
  total: number
  onClose: () => void
  onSuccess: () => void
}

export function CheckoutModal({ items, total, onClose, onSuccess }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const clearCart = useCartStore((s) => s.clearCart)

  // The entry screen already asked for a name and a phone number: reuse them
  // instead of making the visitor type them again. Still editable — someone may
  // order for a friend, or fix a typo.
  const { data: visitor } = useCurrentVisitor()
  useEffect(() => {
    if (!visitor) return
    setFormData((p) => ({
      ...p,
      fullName: p.fullName || `${visitor.firstName} ${visitor.lastName}`,
      phone: p.phone || visitor.phone,
    }))
  }, [visitor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Créer une commande pour chaque produit
      for (const item of items) {
        await api.post('/orders', {
          productId: item.id,
          productTitle: item.title,
          price: item.price,
          quantity: item.cartQuantity,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          status: 'PENDING',
        })
      }
      clearCart()
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la commande')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Finaliser la commande</h2>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 rounded-lg bg-ivory-dim p-4">
          <h3 className="font-medium text-ink mb-3">Résumé</h3>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.title} × {item.cartQuantity}
                </span>
                <span className="font-medium text-ink">
                  {(item.price * item.cartQuantity).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 pt-3 flex justify-between">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-display text-xl text-gold">{total.toFixed(2)}€</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {visitor && (
            <p className="rounded-lg bg-ivory-dim px-3 py-2 text-xs text-ink/50">
              Nom et téléphone repris de votre arrivée sur le site. Modifiables si besoin.
            </p>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-2">
              Nom complet <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, fullName: e.target.value }))
              }
              required
              className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-2">
              Email <span className="text-gold">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
              required
              className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-2">
              Téléphone <span className="text-gold">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              required
              className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-soft disabled:opacity-50"
            >
              {submitting ? 'Traitement...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
