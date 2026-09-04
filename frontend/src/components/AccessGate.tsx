import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthenticated } from '../api/auth'

/**
 * Sign-in screen for the admin panel. The public site has no accounts at all:
 * visitors only leave their name and phone on the entry screen (VisitorGate),
 * so this gate guards /admin and nothing else.
 */
export function AccessGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [hasAccess, setHasAccess] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHasAccess(isAuthenticated('ADMIN'))
    setLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await login(email, password)

      if (user.role !== 'ADMIN') {
        // Only administrators have anything to do here — anyone else belongs
        // on the showcase site, which needs no account.
        setError("Ce compte n'a pas accès à l'administration")
        return
      }

      setHasAccess(true)
      navigate('/admin')
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401) setError('Email ou mot de passe incorrect')
      else setError('Une erreur est survenue, réessaie')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ink to-ink/90">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl text-gold mb-2">Zoro Zipa</h1>
            <p className="text-ivory/60 text-sm">Portail Administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-ivory/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 rounded-lg bg-ivory/10 border border-gold/30 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm text-ivory/80 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 rounded-lg bg-ivory/10 border border-gold/30 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-gold text-ink font-medium hover:bg-gold-soft transition-colors disabled:opacity-60"
            >
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
