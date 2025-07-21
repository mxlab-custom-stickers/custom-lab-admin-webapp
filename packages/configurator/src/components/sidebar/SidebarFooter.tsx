import { cn } from '@clab/utils';
import React from 'react';

type SidebarFooterProps = React.ComponentPropsWithoutRef<'div'>;

export default function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div className={cn('group grid h-14 place-items-center', className)} {...props}>
      <span className="font-['Avant_Garde'] text-xl font-semibold">CUSTOM LAB 2</span>
      <span className="-mt-3 text-sm text-slate-200">
        Powered by{' '}
        <a href="https://mxlab.fr" target="_blank" className="group-hover:underline">
          MXlab
        </a>
      </span>
    </div>
  );
}
