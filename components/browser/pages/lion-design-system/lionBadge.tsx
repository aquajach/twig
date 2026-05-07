import { cva, type VariantProps } from 'class-variance-authority';

export const lionBadge = cva(
  'inline-flex items-center border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
  {
    variants: {
      tone: {
        info: 'border-lionbank-brand text-lionbank-brand',
        success: 'border-emerald-700 text-emerald-700',
        warning: 'border-amber-700 text-amber-700',
      },
    },
    defaultVariants: {
      tone: 'info',
    },
  },
);

export interface LionBadgeVariants extends VariantProps<typeof lionBadge> {}
