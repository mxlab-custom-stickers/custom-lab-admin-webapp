import type { TemplateLayer } from '@clab/types';
import { cn } from '@clab/utils';
import React from 'react';

type LayersMenuItemProps = React.ComponentPropsWithoutRef<'div'> & {
  layer: TemplateLayer;
  active?: boolean;
};

export default function LayersMenuItem({
  className,
  layer,
  active = false,
  ...props
}: LayersMenuItemProps) {
  return (
    <div
      className={cn(
        'flex h-10 min-w-24 cursor-pointer items-center justify-center rounded-md px-2 hover:bg-slate-700',
        { 'bg-yellow-300 text-slate-900 hover:bg-yellow-300 hover:text-slate-900': active },
        className
      )}
      {...props}
    >
      <span className="select-none text-lg font-semibold uppercase">{layer.name}</span>
    </div>
  );
}
