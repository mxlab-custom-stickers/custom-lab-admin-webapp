import ColorSwatch from '@/components/colors/ColorSwatch.tsx';
import ColorPicker from '@/components/configurator/ConfiguratorSidebar/TemplateLayerColor/ColorPicker.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { Color } from '@/models/color.ts';
import React from 'react';

type ColorItemComponentProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorItemComponent({
  className,
  ...props
}: ColorItemComponentProps) {
  const {
    state: { canvas },
    currentColorElement,
    currentLayer,
    updateColorElement,
  } = useConfiguratorContext();

  const colorItem =
    currentColorElement?.type === 'item' ? currentColorElement : null;

  if (!colorItem || !currentLayer || currentLayer.type !== 'color') return null;

  function handleColorSelect(color: Color) {
    if (!currentColorElement || currentColorElement.type !== 'item') return;

    if (canvas) {
      currentColorElement.fabricObjects?.forEach((obj) => {
        obj.set('fill', color.value);
      });
      canvas.requestRenderAll();
    }

    updateColorElement({ ...currentColorElement, color });
  }

  return (
    <div className={className} {...props}>
      <div className="mb-3 flex items-center px-1">
        <ColorSwatch className="mr-1 shrink-0" color={colorItem.color} />
        <InvisibleInput
          className="!text-lg font-semibold"
          value={colorItem.name}
          onSubmit={(value) =>
            updateColorElement({ ...colorItem, name: value })
          }
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
