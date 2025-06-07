import CurrentLayerComponent from '@/components/configurator/ConfiguratorSidebar/CurrentLayerComponent.tsx';
import SidebarFooter from '@/components/configurator/ConfiguratorSidebar/SidebarFooter.tsx';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';

type ConfiguratorSidebarProps = React.ComponentPropsWithoutRef<'div'>;

export default function ConfiguratorSidebar({
  className,
  ...props
}: ConfiguratorSidebarProps) {
  return (
    <div className={cn('w-64 border-r bg-white', className)} {...props}>
      <div className="flex h-full flex-col overflow-hidden">
        <CurrentLayerComponent className="flex-1 overflow-y-auto p-3" />
        <SidebarFooter />
      </div>
    </div>
  );
}
