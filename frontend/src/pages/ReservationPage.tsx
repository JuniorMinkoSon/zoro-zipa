import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Check, Ticket } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useExhibitions } from '../hooks/useExhibitions';
import { useCreateReservation } from '../hooks/useReservations';
import { seedExhibitions } from '../data/seed';
import { cn } from '../utils/cn';

const timeSlots = ['09:00', '11:00', '14:00', '16:00', '18:00'];

export function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialExhibitionId = (location.state as { exhibitionId?: string })?.exhibitionId;
  const { data: exhibitions = [] } = useExhibitions();
  const createReservation = useCreateReservation();

  const allExhibitions = exhibitions.length > 0 ? exhibitions : seedExhibitions;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    exhibitionId: initialExhibitionId || allExhibitions[0]?.id || '',
    date: '',
    time: '',
    visitors: 1,
    name: '',
    email: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  const selectedExhibition = allExhibitions.find((e) => e.id === form.exhibitionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      await createReservation.mutateAsync({
        exhibitionId: form.exhibitionId,
        exhibitionTitle: selectedExhibition?.title || '',
        userId: 'demo-user',
        userName: form.name,
        email: form.email,
        date: form.date,
        time: form.time,
        visitors: form.visitors,
        totalPrice: (selectedExhibition?.price || 0) * form.visitors,
      });
      setConfirmed(true);
    } catch {
      setConfirmed(true);
    }
  };

  if (confirmed) {
    return (
      <div className="pt-32 pb-20 px-6 lg:px-8 min-h-screen bg-ivory">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cream rounded-2xl p-10"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif text-obsidian mb-4">Réservation confirmée</h2>
            <p className="text-muted mb-6">
              Votre visite de <strong>{selectedExhibition?.title}</strong> est réservée pour le {form.date} à {form.time}.
            </p>
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gold/40 mb-6">
              <Ticket className="w-10 h-10 text-gold mx-auto mb-3" />
              <p className="text-xs uppercase tracking-wider text-muted mb-1">QR Code visite</p>
              <p className="text-lg font-mono text-obsidian">ZORO-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-obsidian text-ivory rounded-full hover:bg-stone transition-colors">
              Retour à l accueil
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 lg:px-8 min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto">
        <SectionTitle
          title="Réserver une visite"
          subtitle="Choisissez votre exposition, votre date et horaire pour une expérience culturelle sur mesure."
        />

        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  s <= step ? 'bg-gold text-obsidian' : 'bg-obsidian/10 text-muted'
                )}
              >
                {s}
              </div>
              {s < 3 && <div className={cn('flex-1 h-0.5', s < step ? 'bg-gold' : 'bg-obsidian/10')} />}
            </div>
          ))}
        </div>

        <motion.form
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="bg-cream rounded-2xl p-8 space-y-6"
        >
          {step === 1 && (
            <>
              <h3 className="text-xl font-serif text-obsidian">Choisissez une exposition</h3>
              <div className="space-y-3">
                {allExhibitions.map((ex) => (
                  <label
                    key={ex.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                      form.exhibitionId === ex.id
                        ? 'border-gold bg-gold/5'
                        : 'border-obsidian/10 bg-ivory hover:border-gold/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="exhibition"
                      value={ex.id}
                      checked={form.exhibitionId === ex.id}
                      onChange={() => setForm({ ...form, exhibitionId: ex.id })}
                      className="w-5 h-5 accent-gold"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-obsidian">{ex.title}</p>
                      <p className="text-sm text-muted">{ex.location}</p>
                    </div>
                    <span className="text-gold font-medium">{ex.price.toLocaleString()} FCFA</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-serif text-obsidian">Date et horaire</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted mb-2 block">Date de visite</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-ivory border border-obsidian/10 rounded-xl focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted mb-2 block">Horaire</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setForm({ ...form, time })}
                        className={cn(
                          'py-2.5 rounded-xl text-sm font-medium border transition-all',
                          form.time === time
                            ? 'bg-obsidian text-ivory border-obsidian'
                            : 'bg-ivory text-obsidian border-obsidian/10 hover:border-gold'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted mb-2 block">Nombre de visiteurs</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="number"
                      min={1}
                      max={selectedExhibition?.capacity || 20}
                      value={form.visitors}
                      onChange={(e) => setForm({ ...form, visitors: parseInt(e.target.value, 10) || 1 })}
                      className="w-full pl-12 pr-4 py-3 bg-ivory border border-obsidian/10 rounded-xl focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-xl font-serif text-obsidian">Vos informations</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted mb-2 block">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-ivory border border-obsidian/10 rounded-xl focus:border-gold focus:outline-none"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-ivory border border-obsidian/10 rounded-xl focus:border-gold focus:outline-none"
                    placeholder="jean@example.com"
                  />
                </div>
                <div className="bg-ivory p-4 rounded-xl border border-obsidian/10">
                  <p className="text-sm text-muted">Récapitulatif</p>
                  <p className="text-obsidian font-medium mt-1">{selectedExhibition?.title}</p>
                  <p className="text-sm text-muted mt-1">
                    {form.date} à {form.time} — {form.visitors} visiteur{form.visitors > 1 ? 's' : ''}
                  </p>
                  <p className="text-gold font-medium mt-3">
                    Total : {((selectedExhibition?.price || 0) * form.visitors).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-obsidian/10 rounded-full text-obsidian hover:border-gold transition-colors"
              >
                Retour
              </button>
            )}
            <button
              type="submit"
              className="ml-auto px-8 py-3 bg-obsidian text-ivory rounded-full font-medium hover:bg-stone transition-colors"
            >
              {step === 3 ? 'Confirmer la réservation' : 'Continuer'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
