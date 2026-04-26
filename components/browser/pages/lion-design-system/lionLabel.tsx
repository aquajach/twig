import { cva, type VariantProps } from 'class-variance-authority';

export const lionLabel = cva(['text-sm text-lionbank-fg mb-1 block']);

export interface LionLabelVariants extends VariantProps<typeof lionLabel> {}
