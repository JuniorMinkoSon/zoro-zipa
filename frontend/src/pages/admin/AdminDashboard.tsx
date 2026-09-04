import { useEffect, useState } from 'react'
import { Image, RefreshCw, Ticket, UserCheck, Users } from 'lucide-react'
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
import { useStats, useVisitors } from '../../api/hooks'

const GOLD = '#c6a15b'

/** Overview: KPI tiles + visitors, popular artworks and reservations charts. */
export function AdminDashboard() {
  const { data: stats, isLoading, refetch } = useStats()
  // People who filled the entry screen — distinct from the reservation head count below.
  const { data: visitors } = useVisitors()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      setLastUpdate(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !stats)
    return <p className="text-ink/40">Chargement du tableau de bord…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <AdminHeader title="Dashboard" subtitle="Vue d'ensemble de la plateforme" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink/50">
            Mis à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm text-ink/70 transition-all hover:bg-ink/5 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refresh...' : 'Actualiser'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Œuvres" value={stats.artworks} icon={Image} delay={0.05} />
        <StatCard
          label="Visiteurs enregistrés"
          value={visitors?.length ?? 0}
          icon={UserCheck}
          delay={0.1}
        />
        <StatCard label="Visiteurs attendus" value={stats.visitors} icon={Users} delay={0.15} />
        <StatCard label="Commandes" value={stats.reservations} icon={Ticket} delay={0.2} />
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
          <h3 className="mb-5 font-display text-lg">Œuvres populaires</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.popularArtworks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="title" width={120} fontSize={11} />
              <Tooltip />
              <Bar dataKey="views" name="Vues" fill={GOLD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <div className="border border-ink/10 bg-white p-6">
          <h3 className="mb-5 font-display text-lg">Commandes par mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.reservationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" name="Commandes" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
