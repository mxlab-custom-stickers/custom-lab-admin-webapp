import ColorElementView from '@/components/sidebar/color-element/ColorElementView.tsx';
import LayerHeader from '@/components/sidebar/LayerHeader.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import type { SelectedElement } from '@/contexts/configurator/configurator-types.ts';
import LayerColorView from '@/views/sidebar/LayerColorView.tsx';
import type { TemplateLayerType } from '@clab/types';
import { cn } from '@clab/utils';
import React from 'react';

const layerViewComponents: Record<TemplateLayerType, React.FC> = {
  color: () => <LayerColorView />,
  image: () => <div>image</div>,
  text: () => <div>text</div>,
  background: () => <div>background</div>,
};

const selectedElementComponents: Record<SelectedElement['type'], React.FC> = {
  'color-element': () => <ColorElementView />,
  'canvas-element': () => <div>Selected Canvas Element</div>,
};

export default function SidebarContent({ className }: { className?: string }) {
  const { sidebarView, currentLayer, selectedElement } = useConfigurator();

  return (
    <ScrollArea className={cn('h-full overflow-auto', className)}>
      {sidebarView === 'home' ? (
        <div className="p-2 text-center text-xl">Bienvenue sur Custom Lab</div>
      ) : null}
      {sidebarView === 'current-layer' && currentLayer ? (
        <div className="flex flex-col gap-2">
          <LayerHeader className="p-2" layer={currentLayer} />
          {React.createElement(layerViewComponents[currentLayer.type])}
        </div>
      ) : null}
      {sidebarView === 'selected-element' && selectedElement
        ? React.createElement(selectedElementComponents[selectedElement.type])
        : null}
    </ScrollArea>
  );
}
