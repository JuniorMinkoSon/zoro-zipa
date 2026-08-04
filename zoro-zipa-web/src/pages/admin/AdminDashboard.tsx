import { CalendarCheck, Image, Palette, Ticket, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { StatCard } from '../../components/admin/StatCard'
import { useStats } from '../../api/hooks'

const GOLD = '#c6a15b'
const INK = '#0b0b0b'

/** Overview: KPI tiles + visitors, popular artworks and reservations charts. */
export function AdminDashboard() {
  const { data: stats, isLoading } = useStats()

  if (isLoading || !stats)
    return <p className="text-ink/40">Chargement du tableau de bord…</p>

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Vue d'ensemble de la plateforme" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Artistes" value={stats.artists} icon={Palette} />
        <StatCard label="Œuvres" value={stats.artworks} icon={Image} delay={0.05} />
        <StatCard label="Visiteurs" value={stats.visitors} icon={Users} delay={0.1} />
        <StatCard label="Expositions" value={stats.exhibitions} icon={CalendarCheck} delay={0.15} />
        <StatCard label="Réservations" value={stats.reservations} icon={Ticket} delay={0.2} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="border border-ink/10 bg-white p-6">
          <h3 className="mb-5 font-display text-lg">Évolution des visiteurs</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.visitorsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="value" name="Visiteurs" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ink/10 bg-white p-6">
          <h3 className="mb-5 font-display text-lg">Réservations par mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.reservationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" name="Réservations" fill={INK} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ink/10 bg-white p-6 xl:col-span-2">
          <h3 className="mb-5 font-display text-lg">Œuvres populaires</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.popularArtworks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="title" width={180} fontSize={11} />
              <Tooltip />
              <Bar dataKey="views" name="Vues" fill={GOLD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
