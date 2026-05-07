import { cva } from 'class-variance-authority';

export const lionTable = cva('w-full border-collapse text-sm');
export const lionTableHead = cva(
  'border-b border-lionbank-brand-light text-left text-xs font-semibold text-lionbank-brand',
);
export const lionTableHeaderCell = cva('px-3 py-2');
export const lionTableRow = cva('border-b border-lionbank-brand-lighter');
export const lionTableCell = cva('px-3 py-2 text-lionbank-fg');
