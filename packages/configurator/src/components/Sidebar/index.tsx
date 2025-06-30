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

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <LayerColorComponent />,
  image: <LayerImageComponent />,
  text: <LayerTextComponent />,
  background: <div>Background Layer</div>,
};

type SidebarClassNames = {
  header?: string;
  content?: string;
  footer?: string;
};

type SidebarProps = React.ComponentPropsWithoutRef<'div'> & {
  classNames?: SidebarClassNames;
};

export default function Sidebar({ className, classNames, ...props }: SidebarProps) {
  const { currentLayer } = useConfiguratorContext();

  return (
    <div
      className={cn(
        'w-68 fixed bottom-4 left-4 top-4 z-30 flex flex-col justify-between rounded-xl bg-[#323232] text-white shadow-xl',
        className
      )}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className={cn('border-b border-gray-600 p-3', classNames?.header)} />
      {/* Content*/}
      <ScrollArea className={cn('flex-1 overflow-auto px-3', classNames?.content)}>
        {currentLayer ? (
          <div className="py-2">
            <div className="mb-2 text-2xl font-semibold uppercase">{currentLayer.name}</div>
            <div>{currentLayer.message}</div>
            {currentLayerComponents[currentLayer.type]}
          </div>
        ) : null}
      </ScrollArea>
      {/* Footer */}
      <SidebarFooter className={cn('border-t border-gray-600 p-2', classNames?.footer)} />
    </div>
  );
}
