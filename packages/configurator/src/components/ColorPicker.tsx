import ColorSwatch from '@/components/ColorSwatch.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';
import type { Color } from '@clab/types';
import { cn, compareColorsByLuminance } from '@clab/utils';
import React from 'react';

type ColorPickerProps = React.ComponentPropsWithoutRef<'div'> & {
  colors: Color[];

  columns?: number;
  space?: number;

  value?: Color;
  onValueChange?: (color: Color) => void;
};

export default function ColorPicker({
  className,
  colors,
  columns = 5,
  space = 2,
  value: valueProp,
  onValueChange,
  ...props
}: ColorPickerProps) {
  const [value, setValue] = useControlledState<Color>(valueProp, onValueChange, undefined);

  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${space / 4}rem`,
      }}
      {...props}
    >
      {colors.sort(compareColorsByLuminance).map((color) => (
        <ColorSwatch
          key={color.id}
          className="w-full"
          color={color}
          selectable
          selected={color.id === value?.id}
          onClick={setValue}
        />
      ))}
    </div>
  );
}
