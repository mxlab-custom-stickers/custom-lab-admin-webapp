import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { cn } from '@clab/utils';
import React from 'react';

type LayersMenuProps = React.ComponentPropsWithoutRef<'div'>;

export default function LayersMenu({ className, ...props }: LayersMenuProps) {
  const {
    state: { template, currentLayerId },
    setCurrentLayerId,
  } = useConfigurator();

  return (
    <div
      className={cn(
        'fixed bottom-7 left-72 right-0 z-20 flex h-14 items-center justify-center gap-2 bg-[#323232] text-white shadow-xl',
        className
      )}
      {...props}
    >
      {template.layers.map((layer) => (
        <div
          key={layer.id}
          className={cn(
            'flex h-10 min-w-24 cursor-pointer items-center justify-center rounded-md px-2 hover:bg-[#454545]',
            {
              'bg-yellow-300 text-slate-900 hover:bg-yellow-300 hover:text-slate-900':
                layer.id === currentLayerId,
            }
          )}
          onClick={() => setCurrentLayerId(layer.id)}
        >
          <span className="select-none text-xl font-semibold uppercase">{layer.name}</span>
        </div>
      ))}
    </div>
  );
}
