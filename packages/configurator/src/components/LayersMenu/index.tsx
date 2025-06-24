import LayersMenuItem from '@/components/LayersMenu/LayersMenuItem.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { cn } from '@clab/utils';
import React from 'react';

type LayersMenuProps = React.ComponentPropsWithoutRef<'div'>;

export default function LayersMenu({ className, ...props }: LayersMenuProps) {
  const {
    state: { template, currentLayerId },
    setCurrentLayerId,
  } = useConfiguratorContext();

  return (
    <div className={cn('flex items-center justify-center gap-5', className)} {...props}>
      {template.layers.map((layer) => (
        <LayersMenuItem
          key={layer.id}
          layer={layer}
          active={layer.id === currentLayerId}
          onClick={() => setCurrentLayerId(layer.id)}
        />
      ))}
    </div>
  );
}
