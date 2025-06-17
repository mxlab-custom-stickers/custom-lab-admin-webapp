import { cn } from '@/lib/utils.ts';
import React from 'react';

export default function TypographyH2({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className={cn('scroll-m-20 pb-2 text-3xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  );
}
