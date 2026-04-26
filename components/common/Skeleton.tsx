import type { FC } from 'react';
import { cn } from '@/utils/cn';

export const Skeleton: FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-shimmer bg-fixed bg-[linear-gradient(90deg,transparent_20%,rgba(255,255,255,0.15)_50%,transparent_80%)] bg-[length:200%_100%]',
      className,
    )}
  />
);
