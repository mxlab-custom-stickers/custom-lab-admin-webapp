import { cn } from '@/lib/utils.ts';
import { EditTemplate } from '@/models/template.ts';
import * as React from 'react';
import ColorElement from './ColorElement';
import ColorGroup from './ColorGroup';

type ConfiguratorSidebarProps = React.ComponentPropsWithoutRef<'div'> & {
  template: EditTemplate;
};

export default function ConfiguratorSidebar({
  className,
  template,
  ...props
}: ConfiguratorSidebarProps) {
  const layer = template.layers[0];

  return (
    <div className={cn('w-64 border-r bg-gray-50 p-2', className)} {...props}>
      <div className="mb-2 flex items-center">
        <span className="flex-1 font-semibold">{layer?.name}</span>
      </div>

      <div className="flex flex-col gap-3">
        {layer?.colors?.length ? (
          layer.colors.map((color) =>
            color.type === 'group' ? (
              <ColorGroup key={color.id} colorGroup={color} />
            ) : (
              <ColorElement key={color.id} colorElement={color} />
            )
          )
        ) : (
          <div>TODO</div>
        )}
      </div>
    </div>
  );
}
