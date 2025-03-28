import { cn } from '@/lib/utils.ts';
import { EditTemplate } from '@/models/template.ts';
import * as React from 'react';
import ColorElement from './ColorElement';
import ColorGroup from './ColorGroup';

type SidebarProps = React.ComponentPropsWithoutRef<'div'> & {
  template: EditTemplate;
};

export default function Sidebar({
  className,
  template,
  ...props
}: SidebarProps) {
  const layer = template.layers[0];

  return (
    <div className={cn('w-64 bg-gray-100 p-2', className)} {...props}>
      <div className="mb-2 font-semibold">{layer?.name}</div>

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
