import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { getAllAvailableColors } from '@/lib/configurator.ts';
import { cn } from '@/lib/utils.ts';
import React, { useMemo } from 'react';

type ColorPickerProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorPicker({ className, ...props }: ColorPickerProps) {
  const { currentLayer, currentColorElement } = useConfiguratorContext();

  const availableColors = useMemo(
    () => (currentLayer ? getAllAvailableColors(currentLayer) : []),
    [currentLayer]
  );

  return currentColorElement?.type === 'item' ? (
    <div className={cn(className)} {...props}>
      {availableColors.map((color) => (
        <div key={color.id}>{color.name}</div>
      ))}
    </div>
  ) : null;
}
