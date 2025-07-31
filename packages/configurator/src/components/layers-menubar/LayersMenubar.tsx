import { cn } from '@clab/utils';
import React from 'react';

type LayersMenubarProps = React.ComponentPropsWithoutRef<'div'>;

export default function LayersMenubar({ className, children, ...props }: LayersMenubarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-7 left-72 right-0 z-20 flex h-14 items-center justify-center gap-2 bg-[#323232] shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
