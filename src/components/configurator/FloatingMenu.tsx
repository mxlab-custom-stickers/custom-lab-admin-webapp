import { cn } from '@/lib/utils.ts';
import React from 'react';

export default function FloatingMenu({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'absolute top-16 bottom-8 left-2 z-50 flex w-64 items-center justify-center gap-2 rounded-md bg-white p-2 shadow-xl'
      )}
      {...props}
    ></div>
  );
}
