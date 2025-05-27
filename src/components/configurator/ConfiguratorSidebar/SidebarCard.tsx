import { cn } from '@/lib/utils.ts';
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
        { 'cursor-pointer hover:bg-gray-200/50': !!props.onClick },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
