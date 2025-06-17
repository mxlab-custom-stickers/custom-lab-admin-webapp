import ColorSwatch from '@/components/colors/ColorSwatch.tsx';
import SidebarCard from '@/components/configurator/ConfiguratorSidebar/SidebarCard.tsx';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { getAllColorGroupColors } from '@/lib/configurator.ts';
import { cn } from '@/lib/utils.ts';
import { ColorGroup } from '@/models/template.ts';
import * as React from 'react';
import { useMemo } from 'react';

type ColorGroupCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorGroup: ColorGroup;
};

export default function ColorGroupCard({ className, colorGroup, ...props }: ColorGroupCardProps) {
  const colors = useMemo(
    () => getAllColorGroupColors(colorGroup).sort(compareColorsByLuminance),
    [colorGroup]
  );

  return (
    <SidebarCard className={cn(className)} {...props}>
      <div className="mb-2 text-sm">{colorGroup.name}</div>
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
