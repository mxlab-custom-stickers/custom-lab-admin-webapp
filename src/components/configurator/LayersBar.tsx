import { cn } from '@/lib/utils.ts';
import { EditTemplate } from '@/models/template.ts';
import * as React from 'react';

type LayerBarProps = React.ComponentPropsWithoutRef<'div'> & {
  template: EditTemplate;
};

export default function LayersBar({
  className,
  template,
  ...props
}: LayerBarProps) {
  return (
    <div
      className={cn(
        'flex h-16 w-full items-center justify-center bg-gray-100 px-4 py-2',
        className
      )}
      {...props}
    >
      {template.layers.map((layer) => (
        <div
          className="grid h-10 place-items-center rounded-md bg-gray-200 px-3"
          key={layer.id}
        >
          {layer.name}
        </div>
      ))}
    </div>
  );
}
