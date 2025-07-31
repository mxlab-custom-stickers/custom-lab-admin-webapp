import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { cn } from '@clab/utils';
import React from 'react';

type LayersMenubarItemListProps = React.ComponentPropsWithoutRef<'div'>;

export default function LayersMenubarItemList({ className, ...props }: LayersMenubarItemListProps) {
  const {
    configuration: { layers },
    currentLayer,
    setCurrentLayerId,
  } = useConfigurator();

  return (
    <div className={cn('flex h-10 items-center gap-3', className)} {...props}>
      {layers.map((layer) => (
        <div
          key={layer.id}
          className={cn(
            'flex h-full min-w-24 items-center justify-center rounded-md px-2 text-xl font-semibold uppercase',
            'cursor-pointer select-none hover:bg-[#454545]',
            {
              'text-accent cursor-default bg-[#ffe500] hover:bg-[#ffe500]':
                layer.id === currentLayer?.id,
            }
          )}
          onClick={() => layer.id !== currentLayer?.id && setCurrentLayerId(layer.id)}
        >
          {layer.name}
        </div>
      ))}
    </div>
  );
}
