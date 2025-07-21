import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import type { SidebarViewType } from '@/contexts/configurator-types.ts';
import LayerColorView from '@/views/sidebar/LayerColorView.tsx';
import { cn } from '@clab/utils';
import React from 'react';

const sidebarViewComponents: Record<SidebarViewType, React.ReactNode> = {
  'layer-color': <LayerColorView />,
  'layer-image': <div>Image Layer View</div>,
  'layer-text': <div>Text Layer View</div>,
  'color-element': <div>Color Element View</div>,
  'color-palette': <div>Color Palette View</div>,
  'font-picker': <div>Font Picker View</div>,
  'text-colors': <div>Text colors view</div>,
};

export default function SidebarView({ className }: { className?: string }) {
  const {
    state: { sidebarView },
  } = useConfiguratorContext();

  return (
    <ScrollArea className={cn(className)}>
      {sidebarView ? sidebarViewComponents[sidebarView] : 'Bienvenue sur Custom Lab 2 😎'}
    </ScrollArea>
  );
}
