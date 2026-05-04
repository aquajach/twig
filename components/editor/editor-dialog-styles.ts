import { cva } from 'class-variance-authority';

export const editorModalOverlay = cva(
  'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 outline-none',
);

export const editorModalBase = cva(
  'max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-surface backdrop-blur-xs text-text-primary shadow-xl flex flex-col outline-none',
);

export const editorModalSection = cva('flex flex-col gap-2 px-4');

export const editorModalActions = cva('flex flex-wrap justify-end gap-2 px-4 py-3');

export const editorDialogTitle = cva('text-lg font-semibold');

export const editorModalFieldLabel = cva('text-sm');

export const editorButton = cva(
  'transition-all inline-flex items-center gap-2 rounded border border-specular px-2.5 py-1.5 text-sm outline-none data-[pressed]:border-transparent',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-black data-[hovered]:bg-accent-hover data-[pressed]:bg-accent-hover',
        default: 'bg-specular/50 data-[hovered]:bg-specular data-[pressed]:bg-surface-active',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
