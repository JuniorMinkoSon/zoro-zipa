import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  delay?: number
}

/** KPI tile for the admin dashboard. */
export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 border border-ink/10 bg-white p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-display text-3xl">{value}</p>
        <p className="text-xs uppercase tracking-widest text-ink/50">{label}</p>
      </div>
    </motion.div>
  )
}
