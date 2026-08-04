import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
}

export const inputClass =
  'w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold'

/** Labeled form field used by admin CRUD forms. */
export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ink/50">
        {label}
      </span>
      {children}
    </label>
  )
}
