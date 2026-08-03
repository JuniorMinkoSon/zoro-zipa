import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
  className?: string;
}

export function SectionTitle({ title, subtitle, align = 'center', light = false, className }: SectionTitleProps) {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(alignment, 'mb-12 lg:mb-16', className)}
    >
      <h2 className={cn('text-3xl md:text-4xl lg:text-5xl font-serif font-medium', light ? 'text-ivory' : 'text-obsidian')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed', light ? 'text-ivory/70' : 'text-muted', align === 'left' && 'mx-0')}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
