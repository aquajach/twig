import { cva, type VariantProps } from 'class-variance-authority';

export const lionSectionTitle = cva('text-lionbank-fg', {
  variants: {
    tone: {
      default: 'text-sm font-semibold text-lionbank-brand',
      subtle: 'text-sm font-semibold text-lionbank-secondary',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export interface LionSectionTitleVariants extends VariantProps<typeof lionSectionTitle> {}
