import { cva, type VariantProps } from 'class-variance-authority';

export const lionInput = cva(
  [
    'min-h-11 px-4 border border-lionbank-brand-light bg-lionbank-bg text-lionbank-fg outline-none transition-all ring-2 ring-transparent',
    'data-[focused]:border-lionbank-brand data-[focused]:ring-lionbank-brand-light',
  ],
  {
    variants: {
      variant: {
        default: '',
        readOnly: 'bg-lionbank-brand-lighter/30 text-lionbank-fg/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface LionInputVariants extends VariantProps<typeof lionInput> {}
