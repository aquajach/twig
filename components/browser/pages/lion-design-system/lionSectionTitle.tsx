import { cva, type VariantProps } from 'class-variance-authority';

export const lionSectionTitle = cva('text-lionbank-fg', {
  variants: {
    tone: {
      default: 'text-sm font-semibold',
      subtle: 'text-xs font-medium uppercase tracking-wide text-lionbank-brand',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export interface LionSectionTitleVariants extends VariantProps<typeof lionSectionTitle> {}
