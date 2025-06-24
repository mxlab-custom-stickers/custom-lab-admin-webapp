import ColorPicker from '@/components/ColorPicker.tsx';
import ColorSwatch from '@/components/ColorSwatch.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { type Color, isTemplateLayerColor } from '@clab/types';
import React from 'react';

type ColorItemComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorItemComponent({ className, ...props }: ColorItemComponentProps) {
  const { currentColorElement, currentLayer, updateColorElement } = useConfiguratorContext();

  const { setColorItemsColor } = useCanvas();

  const colorItem = currentColorElement?.type === 'item' ? currentColorElement : null;

  if (!colorItem || !currentLayer || !isTemplateLayerColor(currentLayer)) return null;

  function handleColorSelect(color: Color) {
    if (!currentColorElement || currentColorElement.type !== 'item') return;

    const updatedColorItem = { ...currentColorElement, color };
    setColorItemsColor([updatedColorItem]);
    updateColorElement(updatedColorItem);
  }

  return (
    <div className={className} {...props}>
      <div className="mb-3 flex items-center px-1">
        <ColorSwatch className="mr-1 shrink-0" color={colorItem.color} />
        {colorItem.name}
      </div>

      <ColorPicker
        className="mt-6 p-1"
        colors={currentLayer.config.availableColors}
        columns={currentLayer.config.columns}
        space={currentLayer.config.space}
        value={colorItem.color}
        onValueChange={handleColorSelect}
      />
    </div>
  );
}
