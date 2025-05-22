import ColorChip from '@/components/colors/ColorChip.tsx';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { cn } from '@/lib/utils.ts';
import { Color } from '@/models/color.ts';
import React from 'react';

type ColorPickerProps = React.ComponentPropsWithoutRef<'div'> & {
  colors: Color[];
  columns: number;
  space: number;
};

export default function ColorPicker({
  className,
  colors,
  columns,
  space,
  ...props
}: ColorPickerProps) {
  return (
    <div
      className={cn(`grid`, className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${space / 4}rem`,
      }}
      {...props}
    >
      {colors.sort(compareColorsByLuminance).map((color) => (
        <ColorChip
          key={color.id}
          className="w-full"
          color={color}
          selectable
          showTooltip
        />
      ))}
    </div>
  );
}
