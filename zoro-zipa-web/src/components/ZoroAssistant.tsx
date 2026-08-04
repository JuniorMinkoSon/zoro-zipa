import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles, X } from 'lucide-react'
import { useArtists, useArtworks, useExhibitions } from '../api/hooks'
import type { Artwork } from '../types'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

/**
 * Zoro AI — floating cultural assistant.
 * Answers by searching the live catalogue (artworks, artists, exhibitions)
 * served by the API; ready to be backed by an LLM endpoint later.
 */
export function ZoroAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Bonjour, je suis Zoro, votre guide artistique. Demandez-moi par exemple : « Trouve-moi des œuvres africaines modernes » ou « Parle-moi d'un artiste ».",
    },
  ])
  const listRef = useRef<HTMLDivElement>(null)
  const { data: artworks } = useArtworks()
  const { data: artists } = useArtists()
  const { data: exhibitions } = useExhibitions()

  const answer = useMemo(
    () =>
      (question: string): string => {
        const q = question.toLowerCase()
        const words = q.split(/\W+/).filter((w) => w.length > 3)

        const matches = (haystack: string) =>
          words.some((w) => haystack.toLowerCase().includes(w))

        const describe = (a: Artwork) =>
          `« ${a.title} » (${a.year}) de ${a.artistName} — ${a.technique}. ${a.description}`

        if (q.includes('exposition') || q.includes('visite')) {
          const current = exhibitions?.filter((e) => e.current) ?? []
          if (current.length)
            return `Actuellement à l'affiche : ${current
              .map((e) => `« ${e.title} » (${e.galleryName})`)
              .join(', ')}. Vous pouvez réserver depuis la page Expositions.`
        }

        const artist = artists?.find((a) => matches(a.name) || matches(a.style))
        if (artist && (q.includes('artiste') || matches(artist.name)))
          return `${artist.name} (${artist.nationality}) — style ${artist.style}. ${artist.bio}`

        const found =
          artworks?.filter(
            (a) =>
              matches(a.title) ||
              matches(a.category) ||
              matches(a.technique) ||
              matches(a.description) ||
              matches(a.artistName),
          ) ?? []
        if (found.length)
          return `J'ai trouvé ${found.length} œuvre(s) : ${found
            .slice(0, 3)
            .map(describe)
            .join(' · ')}`

        return "Je n'ai rien trouvé sur ce sujet dans la collection. Essayez un style (moderne, abstrait…), un artiste ou une technique."
      },
    [artworks, artists, exhibitions],
  )

  const send = () => {
    const question = input.trim()
    if (!question) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: question },
      { role: 'assistant', text: answer(question) },
    ])
    setInput('')
    requestAnimationFrame(() =>
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }),
    )
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ouvrir Zoro AI"
        className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold shadow-xl ring-1 ring-gold/40"
      >
        <Sparkles size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-[75] flex h-[520px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl bg-ivory shadow-2xl ring-1 ring-ink/10"
          >
            <div className="flex items-center justify-between bg-ink px-5 py-4 text-ivory">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                <div>
                  <p className="font-display text-lg leading-none">Zoro AI</p>
                  <p className="mt-1 text-[11px] text-ivory/50">Votre guide artistique</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-ivory/60 hover:text-gold">
                <X size={18} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-ink text-ivory'
                      : 'bg-white text-ink shadow-sm ring-1 ring-ink/5'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2 border-t border-ink/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Posez votre question…"
                className="flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
              <button
                onClick={send}
                aria-label="Envoyer"
                className="rounded-full bg-gold p-2.5 text-ink transition-colors hover:bg-gold-soft"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
