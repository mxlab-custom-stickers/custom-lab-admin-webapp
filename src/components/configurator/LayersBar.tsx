import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';

type LayerBarProps = React.ComponentPropsWithoutRef<'div'>;

export default function LayersBar({ className, ...props }: LayerBarProps) {
  const {
    state: {
      template: { layers },
      currentLayer,
    },
    setCurrentLayer,
  } = useConfiguratorContext();

  const templateEditorContext = useOptionalTemplateEditorContext();

  function handleLayerClick(layerId: string) {
    if (templateEditorContext) {
      templateEditorContext.setCurrentLayer(layerId);
    } else {
      setCurrentLayer(layerId);
    }
  }

  return (
    <div
      className={cn(
        'flex h-16 w-full items-center justify-center gap-3 border-t bg-gray-50 px-4 py-2',
        className
      )}
      {...props}
    >
      {layers.map((layer) => (
        <div
          key={layer.id}
          className={cn(
            'hover:border-primary grid h-10 cursor-pointer place-items-center rounded-md border border-transparent bg-gray-200 px-3',
            { 'border-primary bg-gray-300': currentLayer?.id === layer.id }
          )}
          onClick={() => handleLayerClick(layer.id)}
        >
          {layer.name}
        </div>
      ))}
    </div>
  );
}
