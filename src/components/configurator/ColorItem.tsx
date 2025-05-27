import ColorChip from '@/components/colors/ColorChip.tsx';
import ColorPicker from '@/components/configurator/ColorPicker.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { Color } from '@/models/color.ts';
import React from 'react';

type ColorItemComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorItemComponent({
  className,
  ...props
}: ColorItemComponentProps) {
  const { currentColorElement, currentLayer, updateColorElement } =
    useConfiguratorContext();

  const colorItem =
    currentColorElement?.type === 'item' ? currentColorElement : null;

  if (!colorItem || !currentLayer) return null;

  function handleColorSelect(color: Color) {
    if (!currentColorElement || currentColorElement.type !== 'item') return;
    updateColorElement({ ...currentColorElement, color });
  }

  return (
    <div className={className} {...props}>
      <div className="mb-3 flex items-center gap-2">
        <InvisibleInput
          className="!text-lg font-semibold"
          value={colorItem.name}
          onSubmit={(value) =>
            updateColorElement({ ...colorItem, name: value })
          }
        />
        <ColorChip className="shrink-0" color={colorItem.color} />
      </div>

      <ColorPicker
        className="mt-6"
        colors={currentLayer.config.availableColors}
        columns={currentLayer.config.columns}
        space={currentLayer.config.space}
        selectedColor={colorItem.color}
        onSelectColor={handleColorSelect}
      />
    </div>
  );
}
