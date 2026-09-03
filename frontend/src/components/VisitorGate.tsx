import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchCurrentVisitor, registerVisitor } from '../api/visitor'

/**
 * First screen of the showcase site: the visitor gives their name and phone
 * number once, the backend stores it and returns a session cookie. On later
 * visits the cookie is enough and this screen never shows again.
 */
export function VisitorGate({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [identified, setIdentified] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    fetchCurrentVisitor()
      .then((visitor) => {
        if (active) setIdentified(visitor !== null)
      })
      .catch(() => {
        // API unreachable — show the form rather than a blank page.
        if (active) setIdentified(false)
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await registerVisitor({ firstName, lastName, phone })
      setIdentified(true)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Une erreur est survenue, réessaie")
    } finally {
      setSubmitting(false)
    }
  }

  // Nothing is painted while the session is being checked, so a returning
  // visitor never sees the form flash before the site.
  if (checking) return <div className="min-h-screen bg-ink" />

  if (identified) return <>{children}</>

  const fieldClass =
    'w-full bg-transparent border-b border-ivory/20 py-3 text-ivory placeholder-ivory/30 ' +
    'focus:outline-none focus:border-gold transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-14">
          <h1 className="font-display text-5xl text-gold tracking-wide">Zoro Zipa</h1>
          <div className="mx-auto mt-5 h-px w-10 bg-gold/50" />
          <p className="mt-6 text-ivory/50 text-sm leading-relaxed">
            Laissez votre nom pour entrer dans le portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-2 gap-5">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom"
              className={fieldClass}
              autoFocus
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              className={fieldClass}
              required
            />
          </div>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Téléphone"
            className={fieldClass}
            required
          />

          {error && <p className="text-sm text-red-300/90">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 mt-4 border border-gold text-gold tracking-[0.2em] text-xs uppercase
                       hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-50"
          >
            {submitting ? 'Un instant…' : 'Entrer'}
          </button>
        </form>

        <p className="mt-12 text-center text-ivory/25 text-[11px] leading-relaxed">
          Vos informations restent privées et servent uniquement à vous accueillir.
        </p>
      </motion.div>
    </div>
  )
}
