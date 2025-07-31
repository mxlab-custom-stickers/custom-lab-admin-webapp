import { cn } from '@clab/utils';
import React from 'react';

type SidebarProps = React.ComponentPropsWithoutRef<'div'>;

export default function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        'w-68 fixed bottom-4 left-4 top-4 z-30 flex select-none flex-col justify-between rounded-xl bg-[#323232] shadow-xl'
      )}
      {...props}
    >
      {children}
    </div>
  );
}
