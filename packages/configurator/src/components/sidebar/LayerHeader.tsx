import type { TemplateLayer } from '@clab/types';
import { cn } from '@clab/utils';
import React from 'react';

type LayerHeaderProps = React.ComponentPropsWithoutRef<'div'> & {
  layer: TemplateLayer;
};

export default function LayerHeader({ className, layer, ...props }: LayerHeaderProps) {
  return (
    <div className={cn('text-center', className)} {...props}>
      <div className="mb-1 text-2xl font-semibold uppercase">{layer.name}</div>
      {!layer.message ? (
        <div className="leading-5">Un super message pour mon super calque 👍</div>
      ) : null}
    </div>
  );
}
