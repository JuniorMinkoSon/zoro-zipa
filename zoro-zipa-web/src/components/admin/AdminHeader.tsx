import type { ReactNode } from 'react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

/** Page header used across all back-office pages. */
export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}
