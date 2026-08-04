import { Reveal } from './Reveal'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  className?: string
}

/** Editorial section heading with a gold underline. */
export function SectionTitle({ eyebrow, title, className = '' }: SectionTitleProps) {
  return (
    <Reveal className={className}>
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      )}
      <h2 className="gold-underline font-display text-3xl font-medium md:text-4xl">
        {title}
      </h2>
    </Reveal>
  )
}
