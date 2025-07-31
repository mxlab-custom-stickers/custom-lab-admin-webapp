import { cn } from '@clab/utils';
import React from 'react';

export default function Toolbar({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'absolute right-4 top-4 z-50 flex h-11 items-center justify-center gap-2 rounded-md bg-[#323232ee] p-1 shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
