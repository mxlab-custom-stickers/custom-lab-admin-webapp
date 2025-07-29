import ColorSwatch from '@/components/ColorSwatch.tsx';
import SidebarCard from '@/components/sidebar/SidebarCard.tsx';
import type { ColorElement } from '@clab/types';
import { cn, compareColorsByLuminance, getAllColorGroupColors } from '@clab/utils';
import * as React from 'react';
import { useMemo } from 'react';

type ColorElementCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorElement: ColorElement;
};

export default function ColorElementCard({
  className,
  colorElement,
  ...props
}: ColorElementCardProps) {
  const colors = useMemo(() => {
    if (colorElement.type === 'group') {
      return getAllColorGroupColors(colorElement).sort(compareColorsByLuminance);
    } else if (colorElement.type === 'item') {
      return [colorElement.color];
    }
    return [];
  }, [colorElement]);

  return (
    <SidebarCard className={cn(className)} {...props}>
      <div className="mb-2">{colorElement.name}</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {colors.map((color, index) => (
          <ColorSwatch
            key={color.id ? `${color.id}-${index}` : index}
            className="h-9 w-9"
            color={color}
          />
        ))}
      </div>
    </SidebarCard>
  );
}
