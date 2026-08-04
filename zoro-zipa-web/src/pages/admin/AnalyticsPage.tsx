import { Eye, Flame, TrendingUp, Users } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { StatCard } from '../../components/admin/StatCard'
import { useArtists, useArtworks, useStats } from '../../api/hooks'

const GOLD = '#c6a15b'

/** Detailed analytics: visitors, artwork views, popular artists and trends. */
export function AnalyticsPage() {
  const { data: stats } = useStats()
  const { data: artworks } = useArtworks()
  const { data: artists } = useArtists()

  if (!stats) return <p className="text-ink/40">Chargement des statistiques…</p>

  const totalViews = artworks?.reduce((sum, a) => sum + a.views, 0) ?? 0

  const artistViews = (artists ?? [])
    .map((artist) => ({
      name: artist.name,
      views:
        artworks
          ?.filter((a) => a.artistId === artist.id)
          .reduce((sum, a) => sum + a.views, 0) ?? 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)

  const trendingCount = artworks?.filter((a) => a.trending).length ?? 0

  return (
    <div>
      <AdminHeader title="Analytics" subtitle="Tendances et audience de la plateforme" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Visiteurs" value={stats.visitors} icon={Users} />
        <StatCard label="Vues d'œuvres" value={totalViews} icon={Eye} delay={0.05} />
        <StatCard label="Œuvres tendances" value={trendingCount} icon={Flame} delay={0.1} />
        <StatCard label="Réservations" value={stats.reservations} icon={TrendingUp} delay={0.15} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="border border-ink/10 bg-white p-6">
          <h3 className="mb-5 font-display text-lg">Audience mensuelle</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.visitorsByMonth}>
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="value" name="Visiteurs" stroke={GOLD} fill="url(#goldFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ink/10 bg-white p-6">
          <h3 className="mb-5 font-display text-lg">Artistes populaires</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={artistViews} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="name" width={150} fontSize={11} />
              <Tooltip />
              <Bar dataKey="views" name="Vues" fill="#0b0b0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ink/10 bg-white p-6 xl:col-span-2">
          <h3 className="mb-5 font-display text-lg">Œuvres les plus consultées</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.popularArtworks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="title" fontSize={10} interval={0} angle={-12} textAnchor="end" height={60} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="views" name="Vues" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
