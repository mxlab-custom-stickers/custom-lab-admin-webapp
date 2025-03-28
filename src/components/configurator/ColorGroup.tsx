import { getAllColorGroupColors } from '@/lib/template-editor.ts';
import { cn } from '@/lib/utils.ts';
import { Color } from '@/models/color.ts';
import { ColorGroup } from '@/models/template.ts';
import * as React from 'react';
import { useState } from 'react';

type ColorGroupProps = React.ComponentPropsWithoutRef<'div'> & {
  colorGroup: ColorGroup;
};

export default function ColorGroupComponent({
  className,
  colorGroup,
  ...props
}: ColorGroupProps) {
  const [colors] = useState<Color[]>(getAllColorGroupColors(colorGroup));

  return (
    <div className={cn(className)} {...props}>
      <div className="mb-1 text-sm">{colorGroup.name}</div>

      <div className="flex flex-wrap items-center gap-2">
        {/* TODO: use color id instead of index */}
        {colors.map((color, index) => (
          <div
            key={index}
            className="h-9 w-9 rounded"
            style={{ backgroundColor: color.value }}
          ></div>
        ))}
      </div>
    </div>
  );
}
