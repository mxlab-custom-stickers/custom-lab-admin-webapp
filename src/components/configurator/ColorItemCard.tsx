import ColorChip from '@/components/colors/ColorChip.tsx';
import { cn } from '@/lib/utils.ts';
import { ColorItem } from '@/models/template.ts';
import * as React from 'react';

type ColorItemCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorItem: ColorItem;
};

export default function ColorItemCard({
  className,
  colorItem,
  onClick,
  ...props
}: ColorItemCardProps) {
  return (
    <div
      className={cn(
        'rounded p-2',
        'flex items-center',
        { 'cursor-pointer hover:bg-gray-200/50': !!onClick },
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex-1">{colorItem.name}</div>
      <ColorChip color={colorItem.color} />
    </div>
  );
}
