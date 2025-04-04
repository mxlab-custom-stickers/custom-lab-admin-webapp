import ColorChip from '@/components/colors/ColorChip.tsx';
import { getAllColorGroupColors } from '@/lib/template-editor.ts';
import { cn } from '@/lib/utils.ts';
import { ColorGroup } from '@/models/template.ts';
import * as React from 'react';
import { useMemo } from 'react';

type ColorGroupCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorGroup: ColorGroup;
};

export default function ColorGroupCard({
  className,
  colorGroup,
  onClick,
  ...props
}: ColorGroupCardProps) {
  const colors = useMemo(
    () => getAllColorGroupColors(colorGroup),
    [colorGroup]
  );

  return (
    <div
      className={cn(
        'rounded p-2',
        { 'cursor-pointer hover:bg-gray-200/50': !!onClick },
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="mb-2 text-sm">{colorGroup.name}</div>

      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color, index) => (
          <ColorChip
            key={color.id ? color.id : index}
            className="h-9 w-9"
            color={color}
          />
        ))}
      </div>
    </div>
  );
}
