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
        'p-3',
        { 'cursor-pointer underline-offset-2 hover:bg-[#454545] hover:underline': !!props.onClick },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
