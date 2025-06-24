import { cn } from '@clab/utils';
import React from 'react';

export default function SidebarCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded p-2',
        { 'cursor-pointer hover:bg-gray-600': !!props.onClick },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
