import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { compareColorsByLuminance } from '@/lib/colors.ts';
import { cn } from '@/lib/utils.ts';
import { ColorPalette } from '@/models/color.ts';
import React from 'react';

type ColorPaletteCardProps = React.ComponentPropsWithoutRef<'div'> & {
  colorPalette: ColorPalette;
  selected?: boolean;
  selectable?: boolean;
};

export default function ColorPaletteCard({
  className,
  colorPalette,
  selected = false,
  selectable = false,
  ...props
}: ColorPaletteCardProps) {
  return (
    <Card
      className={cn(
        '@container bg-gray-50/50 shadow-none',
        { 'group hover:border-primary cursor-pointer': selectable },
        { 'bg-gray-100': selected },
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle
          className={cn({
            'flex items-start justify-between group-hover:underline':
              selectable,
          })}
        >
          <span>
            {colorPalette.name} ({colorPalette.colors.length})
          </span>
          {selectable ? <Checkbox checked={selected} /> : null}
        </CardTitle>

        {colorPalette.description ? (
          <CardDescription>{colorPalette.description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-5 gap-2 @sm:grid-cols-8">
          {colorPalette.colors.sort(compareColorsByLuminance).map((color) => (
            <div
              key={color.id}
              className="aspect-square w-full rounded"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
