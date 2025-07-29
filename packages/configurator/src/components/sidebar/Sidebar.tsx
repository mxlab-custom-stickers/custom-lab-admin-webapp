import { cn } from '@clab/utils';
import React from 'react';

type SidebarProps = React.ComponentPropsWithoutRef<'div'>;

export default function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        // 'max-md:bottom-0 max-md:left-0 max-md:top-[unset] max-md:h-[25svh] max-md:w-full max-md:rounded-none max-md:shadow-none',
        'w-68 fixed bottom-4 left-4 top-4 z-30 flex flex-col justify-between rounded-xl bg-[#323232] text-white shadow-xl'
      )}
      {...props}
    >
      {children}
    </div>
  );
}
