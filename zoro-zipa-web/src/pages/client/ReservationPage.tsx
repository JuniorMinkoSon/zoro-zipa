import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Check, ChevronLeft } from 'lucide-react'
import { useCreateReservation, useExhibitions } from '../../api/hooks'
import type { Reservation } from '../../types'
import { formatDate } from '../../utils/format'

const TIME_SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00']
const STEPS = ['Exposition', 'Date', 'Horaire', 'Visiteurs', 'Confirmation']

/** 5-step reservation flow ending with a QR-coded ticket. */
export function ReservationPage() {
  const [params] = useSearchParams()
  const { data: exhibitions } = useExhibitions()
  const createReservation = useCreateReservation()

  const preselected = params.get('exposition')
  const [step, setStep] = useState(0)
  const [exhibitionId, setExhibitionId] = useState<number | null>(
    preselected ? Number(preselected) : null,
  )
  const [visitDate, setVisitDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [visitors, setVisitors] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [ticket, setTicket] = useState<Reservation | null>(null)

  const exhibition = useMemo(
    () => exhibitions?.find((e) => e.id === exhibitionId),
    [exhibitions, exhibitionId],
  )

  const canNext = [
    exhibitionId !== null,
    visitDate !== '',
    timeSlot !== '',
    visitors >= 1,
    fullName.trim() !== '' && email.includes('@'),
  ][step]

  const submit = () => {
    if (!exhibitionId) return
    createReservation.mutate(
      { exhibitionId, visitDate, timeSlot, visitors, fullName, email },
      { onSuccess: setTicket },
    )
  }

  if (ticket) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-32 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink">
            <Check size={26} />
          </div>
          <h1 className="mt-6 font-display text-3xl">Réservation confirmée</h1>
          <p className="mt-2 text-sm text-ink/50">
            Présentez ce QR code à l'entrée de l'exposition.
          </p>

          <div className="mx-auto mt-10 max-w-sm border border-ink/10 bg-white p-8 shadow-sm">
            <QRCodeSVG value={ticket.code} size={180} className="mx-auto" />
            <p className="mt-5 font-mono text-sm tracking-widest text-gold">{ticket.code}</p>
            <div className="mt-6 space-y-1.5 border-t border-ink/10 pt-5 text-left text-sm">
              <p className="font-display text-lg">{ticket.exhibitionTitle}</p>
              <p className="text-ink/60">
                {formatDate(ticket.visitDate)} à {ticket.timeSlot}
              </p>
              <p className="text-ink/60">
                {ticket.visitors} visiteur(s) · {ticket.fullName}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-28">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Billetterie</p>
      <h1 className="gold-underline font-display text-4xl">Réserver une visite</h1>

      {/* Stepper */}
      <ol className="mt-12 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i < step
                  ? 'bg-gold text-ink'
                  : i === step
                    ? 'bg-ink text-ivory'
                    : 'border border-ink/20 text-ink/40'
              }`}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </span>
            <span className={`hidden text-[11px] sm:block ${i === step ? 'text-ink' : 'text-ink/40'}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
          className="mt-10 min-h-[280px]"
        >
          {step === 0 && (
            <div className="space-y-3">
              {exhibitions?.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setExhibitionId(e.id)}
                  className={`flex w-full items-center gap-4 border p-3 text-left transition-all ${
                    exhibitionId === e.id
                      ? 'border-gold bg-gold/10'
                      : 'border-ink/10 bg-white hover:border-gold/50'
                  }`}
                >
                  <img src={e.posterUrl} alt="" className="h-16 w-16 object-cover" />
                  <div>
                    <p className="font-display">{e.title}</p>
                    <p className="text-xs text-ink/50">
                      {e.galleryName} · {e.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <label className="mb-2 block text-sm text-ink/60">
                Choisissez votre date de visite
              </label>
              <input
                type="date"
                value={visitDate}
                min={new Date().toISOString().split('T')[0]}
                max={exhibition?.endDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
              />
              {exhibition && (
                <p className="mt-3 text-xs text-ink/40">
                  « {exhibition.title} » — jusqu'au {formatDate(exhibition.endDate)}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-full py-3 text-sm transition-all ${
                    timeSlot === slot
                      ? 'bg-gold text-ink'
                      : 'border border-ink/15 hover:border-gold'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="mb-2 block text-sm text-ink/60">Nombre de visiteurs</label>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setVisitors((v) => Math.max(1, v - 1))}
                  className="h-11 w-11 rounded-full border border-ink/15 text-lg hover:border-gold"
                >
                  −
                </button>
                <span className="w-10 text-center font-display text-3xl">{visitors}</span>
                <button
                  onClick={() => setVisitors((v) => Math.min(10, v + 1))}
                  className="h-11 w-11 rounded-full border border-ink/15 text-lg hover:border-gold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="border border-ink/10 bg-white p-5 text-sm">
                <p className="font-display text-lg">{exhibition?.title}</p>
                <p className="mt-1 text-ink/60">
                  {visitDate && formatDate(visitDate)} à {timeSlot} · {visitors} visiteur(s)
                </p>
              </div>
              <input
                placeholder="Nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
              />
              {createReservation.isError && (
                <p className="text-sm text-red-600">
                  La réservation a échoué. Vérifiez que l'API est démarrée puis réessayez.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-full border border-ink/15 px-6 py-3 text-sm transition-colors hover:border-gold disabled:opacity-30"
        >
          <ChevronLeft size={15} /> Retour
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="rounded-full bg-ink px-8 py-3 text-sm text-ivory transition-colors hover:bg-gold hover:text-ink disabled:opacity-30"
          >
            Continuer
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!canNext || createReservation.isPending}
            className="rounded-full bg-gold px-8 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-40"
          >
            {createReservation.isPending ? 'Confirmation…' : 'Confirmer la réservation'}
          </button>
        )}
      </div>
    </div>
  )
}
