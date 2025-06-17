import { cn } from '@/lib/utils.ts';
import React from 'react';

export default function TypographyH1({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={cn('scroll-m-20 text-balance text-4xl font-extrabold tracking-tight', className)}
      {...props}
    >
      {children}
    </h1>
  );
}
