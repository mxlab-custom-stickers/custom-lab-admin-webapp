import ColorSwatch from '@/components/colors/ColorSwatch.tsx';
import ColorPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPicker.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { useConfiguratorCanvas } from '@/hooks/use-configurator-canvas.ts';
import { Color } from '@/models/color.ts';
import { isTemplateLayerColor } from '@/models/template.ts';
import React from 'react';

type ColorItemComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorItemComponent({ className, ...props }: ColorItemComponentProps) {
  const { currentColorElement, currentLayer, updateColorElement } = useConfiguratorContext();

  const { setColorItemsColor } = useConfiguratorCanvas();

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
        <InvisibleInput
          className="!text-lg font-semibold"
          value={colorItem.name}
          onValueSubmit={(value) => updateColorElement({ ...colorItem, name: value })}
        />
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
