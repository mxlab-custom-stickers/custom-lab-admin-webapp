import { cn } from '@/lib/utils.ts';
import React from 'react';

export default function MainContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-[calc(100svh-4rem)] p-4 pt-6 group-has-[[data-collapsible=icon]]/sidebar-wrapper:min-h-[calc(100svh-3rem)]',
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl flex-1">{children}</div>
    </div>
  );
}
