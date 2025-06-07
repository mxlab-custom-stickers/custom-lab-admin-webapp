import ColorSwatch from '@/components/colors/ColorSwatch.tsx';
import SidebarCard from '@/components/configurator/ConfiguratorSidebar/SidebarCard.tsx';
import { cn } from '@/lib/utils.ts';
import { ColorItem } from '@/models/template.ts';
import * as React from 'react';

type ColorItemCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorItem: ColorItem;
};

export default function ColorItemCard({
  className,
  colorItem,
  ...props
}: ColorItemCardProps) {
  return (
    <SidebarCard className={cn(className)} {...props}>
      <div className="flex items-center">
        <div className="flex-1">{colorItem.name}</div>
        <ColorSwatch color={colorItem.color} />
      </div>
    </SidebarCard>
  );
}
