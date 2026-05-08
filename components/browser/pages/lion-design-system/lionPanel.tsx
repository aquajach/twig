import { cva, type VariantProps } from 'class-variance-authority';

export const lionPanel = cva('bg-lionbank-bg p-4');

export interface LionPanelVariants extends VariantProps<typeof lionPanel> {}
