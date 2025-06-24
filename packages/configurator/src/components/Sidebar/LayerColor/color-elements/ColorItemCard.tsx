import ColorSwatch from '@/components/ColorSwatch.tsx';
import SidebarCard from '@/components/Sidebar/SidebarCard.tsx';
import type { ColorItem } from '@clab/types';
import { cn } from '@clab/utils';
import * as React from 'react';

type ColorItemCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorItem: ColorItem;
};

export default function ColorItemCard({ className, colorItem, ...props }: ColorItemCardProps) {
  return (
    <SidebarCard className={cn(className)} {...props}>
      <div className="flex items-center">
        <div className="flex-1 text-base">{colorItem.name}</div>
        <ColorSwatch color={colorItem.color} />
      </div>
    </SidebarCard>
  );
}
