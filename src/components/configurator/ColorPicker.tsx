import ColorChip from '@/components/colors/ColorChip.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-context.ts';
import { getAllAvailableColors } from '@/lib/configurator.ts';
import { changeColor } from '@/lib/svg.ts';
import { cn } from '@/lib/utils.ts';
import { Color } from '@/models/color.ts';
import React, { useMemo } from 'react';

type ColorPickerProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorPicker({ className, ...props }: ColorPickerProps) {
  const {
    template: { id: svgId },
    currentLayer,
    currentColorElement,
    updateCurrentColorElement,
  } = useConfiguratorContext();

  const availableColors = useMemo(
    () => (currentLayer ? getAllAvailableColors(currentLayer) : []),
    [currentLayer]
  );

  function handleColorPick(color: Color) {
    if (currentColorElement?.type !== 'item') return;
    changeColor(svgId, currentColorElement.id, color.value);
    updateCurrentColorElement({ ...currentColorElement, color });
  }

  return currentLayer && currentColorElement?.type === 'item' ? (
    <div
      className={cn(`grid`, className)}
      style={{
        gridTemplateColumns: `repeat(${currentLayer.config.columns}, 1fr)`,
        gap: `${currentLayer.config.space / 4}rem`,
      }}
      {...props}
    >
      {availableColors.map((color) => (
        <ColorChip
          key={color.id}
          className="w-full"
          color={color}
          onClick={() => handleColorPick(color)}
          selectable
          selected={color.id === currentColorElement.color.id}
          showTooltip
        />
      ))}
    </div>
  ) : null;
}
