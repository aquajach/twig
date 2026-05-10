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

/** Storyline flow toolbar + context menus — WinUI-style tokens from app/globals.css */
export const storylineToolbarPanel =
  'z-10 m-2 flex flex-wrap items-center gap-2 rounded-lg bg-surface p-2 text-sm text-text-primary shadow-xl backdrop-blur-sm';

export const storylineToolbarBtnBase =
  'nodrag inline-flex text-sm items-center gap-1.5 rounded-sm px-2 py-1 outline-none transition data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[hovered]:brightness-105 data-[pressed]:brightness-95';

export const storylineToolbarBtnPrimary = `${storylineToolbarBtnBase} bg-accent text-black data-[hovered]:bg-accent-hover data-[pressed]:bg-accent-hover`;

export const storylineToolbarBtnSecondary = `${storylineToolbarBtnBase} border border-specular bg-specular/40 text-text-primary data-[hovered]:bg-specular data-[pressed]:bg-surface-active`;

export const storylineKbdHint = 'rounded-sm bg-current/10 px-1 font-sans text-xs';

export const storylineMenuSurface =
  'nodrag min-w-44 rounded-lg border border-specular bg-surface p-1 text-sm text-text-primary shadow-xl outline-none backdrop-blur-sm';

export const storylineMenuItem =
  'nodrag flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[focused]:bg-surface-hover data-[hovered]:bg-surface-hover';

export const storylineMenuSubmenuTrigger =
  'nodrag flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 outline-none data-[focused]:bg-surface-hover data-[focused]:open:bg-surface-active data-[hovered]:bg-surface-hover data-[open]:bg-surface-active';
