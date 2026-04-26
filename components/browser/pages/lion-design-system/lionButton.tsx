import { cva, type VariantProps } from 'class-variance-authority';

export const lionButton = cva(
  ['min-h-11 px-4 flex items-center justify-center font-bold cursor-pointer text-sm transition-all'],
  {
    variants: {
      variant: {
        primary: [
          'bg-lionbank-brand',
          'text-lionbank-bg',
          'data-[hovered]:bg-lionbank-brand-light',
          'data-[pressed]:bg-lionbank-brand-light',
        ],
        secondary: [
          'bg-lionbank-brand-lighter',
          'text-lionbank-fg',
          'data-[hovered]:bg-lionbank-brand-lighter',
          'data-[pressed]:bg-lionbank-brand-lighter',
        ],
      },
    },
  },
);

export interface LionButtonVariants extends VariantProps<typeof lionButton> {}
