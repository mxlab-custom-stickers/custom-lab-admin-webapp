import LayerColorComponent from '@/components/Sidebar/LayerColor/LayerColorComponent.tsx';
import LayerImageComponent from '@/components/Sidebar/LayerImage/LayerImageComponent.tsx';
import LayerTextComponent from '@/components/Sidebar/LayerText/LayerTextComponent.tsx';
import SidebarFooter from '@/components/Sidebar/SidebarFooter.tsx';
import SidebarHeader from '@/components/Sidebar/SidebarHeader.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import type { TemplateLayerType } from '@clab/types';
import { cn } from '@clab/utils';
import React, { type ReactNode } from 'react';

type SidebarProps = React.ComponentPropsWithoutRef<'div'>;

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <LayerColorComponent />,
  image: <LayerImageComponent />,
  text: <LayerTextComponent />,
  background: <div>Background Layer</div>,
};

export default function Sidebar({ className, ...props }: SidebarProps) {
  const { currentLayer } = useConfiguratorContext();

  return (
    <div
      className={cn('flex flex-col justify-between rounded-xl text-white', className)}
      {...props}
    >
      <SidebarHeader className="border-b border-gray-600 p-3" />
      <ScrollArea className="flex-1 overflow-auto p-3">
        {currentLayer ? (
          <>
            <div className="mb-2 text-2xl font-semibold uppercase">{currentLayer.name}</div>
            <div>{currentLayer.message}</div>
            {currentLayerComponents[currentLayer.type]}
          </>
        ) : null}
      </ScrollArea>
      <SidebarFooter className="border-t border-gray-600 p-2" />
    </div>
  );
}
