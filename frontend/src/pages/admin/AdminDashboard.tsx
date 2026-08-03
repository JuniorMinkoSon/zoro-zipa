import { motion } from 'framer-motion';
import { Palette, Users, Eye, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';
import { seedAnalytics } from '../../data/seed';

const statsConfig = [
  { key: 'totalArtists', label: 'Artistes', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { key: 'totalArtworks', label: 'Œuvres', icon: Palette, color: 'bg-gold/10 text-gold-dark' },
  { key: 'totalVisitors', label: 'Visiteurs', icon: Eye, color: 'bg-green-50 text-green-600' },
  { key: 'totalExhibitions', label: 'Expositions', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
];

const COLORS = ['#C9A962', '#0B0B0B', '#6B6B6B', '#DDCB9A'];

export function AdminDashboard() {
  const { data: analytics } = useAnalytics();
  const data = analytics || seedAnalytics;

  const stats = statsConfig.map((s) => ({
    ...s,
    value: data[s.key as keyof typeof data] as number,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-obsidian">Dashboard</h1>
        <p className="text-muted mt-1">Vue d ensemble de l'activité culturelle.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-ivory rounded-2xl p-6 border border-obsidian/5 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-serif text-obsidian">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ivory rounded-2xl p-6 border border-obsidian/5 shadow-sm">
          <h3 className="text-lg font-serif text-obsidian mb-6">Évolution des visiteurs</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.visitorTrend}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A962" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A962" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#C9A962" fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-ivory rounded-2xl p-6 border border-obsidian/5 shadow-sm">
          <h3 className="text-lg font-serif text-obsidian mb-6">Œuvres populaires</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.popularArtworks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="views" fill="#C9A962" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ivory rounded-2xl p-6 border border-obsidian/5 shadow-sm">
          <h3 className="text-lg font-serif text-obsidian mb-6">Réservations par statut</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.reservationsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.reservationsByStatus.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-ivory rounded-2xl p-6 border border-obsidian/5 shadow-sm">
          <h3 className="text-lg font-serif text-obsidian mb-6">Artistes populaires</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.popularArtists.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="views" fill="#0B0B0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
