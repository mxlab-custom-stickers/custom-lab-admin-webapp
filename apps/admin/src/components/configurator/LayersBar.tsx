import LayerIcon from '@/components/configurator/LayerIcon.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';

type LayerBarProps = React.ComponentPropsWithoutRef<'div'>;

export default function LayersBar({ className, ...props }: LayerBarProps) {
  const {
    state: { template },
    currentLayer,
    setCurrentLayerId,
  } = useConfiguratorContext();

  const { layers } = template;

  function handleLayerClick(layerId: string) {
    setCurrentLayerId(layerId);
  }

  return (
    <div
      className={cn(
        'flex h-16 w-full items-center justify-center gap-3 border-t bg-white px-4 py-2',
        className
      )}
      {...props}
    >
      {layers.map((layer) => (
        <div
          key={layer.id}
          className={cn(
            'hover:border-primary flex h-10 cursor-pointer items-center justify-center rounded-md border border-transparent bg-gray-200 px-3',
            { 'border-gray-400/75 bg-gray-300': currentLayer?.id === layer.id }
          )}
          onClick={() => handleLayerClick(layer.id)}
        >
          <LayerIcon className="mr-2" type={layer.type} size={16} />
          <span className="text-sm">{layer.name}</span>
        </div>
      ))}
    </div>
  );
}
