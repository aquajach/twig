import { cva, type VariantProps } from 'class-variance-authority';

export const lionKeyValueRow = cva('flex items-center justify-between border-b border-lionbank-brand-lighter py-2', {
  variants: {
    emphasis: {
      normal: 'text-sm',
      strong: 'text-base font-semibold',
    },
  },
  defaultVariants: {
    emphasis: 'normal',
  },
});

export interface LionKeyValueRowVariants extends VariantProps<typeof lionKeyValueRow> {}
