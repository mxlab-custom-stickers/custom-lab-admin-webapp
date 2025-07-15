import FontPicker from '@/components/Sidebar/FontPicker.tsx';
import LayerColorComponent from '@/components/Sidebar/LayerColor';
import LayerImageComponent from '@/components/Sidebar/LayerImage/LayerImageComponent.tsx';
import LayerTextComponent from '@/components/Sidebar/LayerText/LayerTextComponent.tsx';
import SidebarFooter from '@/components/Sidebar/SidebarFooter.tsx';
import SidebarHeader from '@/components/Sidebar/SidebarHeader.tsx';
import TextColorPicker from '@/components/Sidebar/TextColorPicker.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import type { SidebarView } from '@/contexts/configurator-types.ts';
import type { TemplateLayerType } from '@clab/types';
import { cn } from '@clab/utils';
import React, { type ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <LayerColorComponent />,
  image: <LayerImageComponent />,
  text: <LayerTextComponent />,
  background: <div>Background Layer</div>,
};

const sidebarViewComponents: Record<SidebarView['type'], ReactNode> = {
  'color-palette': <div />,
  'font-picker': <FontPicker />,
  'text-color-picker': <TextColorPicker />,
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
  const {
    state: { sidebarView },
    currentLayer,
    selectedColorElement,
  } = useConfiguratorContext();

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
      <ScrollArea className={cn('flex-1 overflow-auto', classNames?.content)}>
        {sidebarView ? (
          <div>{sidebarViewComponents[sidebarView.type]}</div>
        ) : currentLayer ? (
          <div>
            {/* Show the layer header only if no color element is selected (color layer only) */}
            {!selectedColorElement ? (
              <div className="px-3 py-2">
                <div className="text-2xl font-semibold uppercase">{currentLayer.name}</div>
                <div>
                  {currentLayer.message ||
                    'Un message porub  hyfg ezuygf ezuyfguyezf uyieuyfgzeyu fuyz'}
                </div>
              </div>
            ) : null}
            {/* Show the component corresponding to the current layer type */}
            {currentLayerComponents[currentLayer.type]}
          </div>
        ) : null}
      </ScrollArea>

      {/* Footer */}
      <SidebarFooter className={cn('border-t border-gray-600 p-2', classNames?.footer)} />
    </div>
  );
}
