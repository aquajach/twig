import { cva, type VariantProps } from 'class-variance-authority';

export const lionTab = cva(['min-h-11 px-4 flex items-center justify-center font-bold text-sm transition-all'], {
  variants: {
    isSelected: {
      true: ['border-b border-lionbank-brand border-b-2', 'text-lionbank-brand'],
      false: ['text-lionbank-secondary'],
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export interface LionTabVariants extends VariantProps<typeof lionTab> {}
