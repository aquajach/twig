import { cva, type VariantProps } from 'class-variance-authority';

export const lionPanel = cva('border border-lionbank-brand-light bg-lionbank-bg p-4', {
  variants: {
    variant: {
      default: '',
      muted: 'bg-lionbank-brand-lighter/40',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LionPanelVariants extends VariantProps<typeof lionPanel> {}
