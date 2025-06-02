import { Separator } from '@/components/ui/separator.tsx';
import { SidebarTrigger } from '@/components/ui/sidebar.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

type HeaderProps = React.ComponentPropsWithoutRef<'header'>;

export default function Header({ className, children, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12',
        className
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 !h-4" orientation="vertical" />
      {children}
    </header>
  );
}
