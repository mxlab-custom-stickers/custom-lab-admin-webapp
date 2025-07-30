import ColorElementList from '@/components/sidebar/LayerColor/color-elements/ColorElementList.tsx';
import ColorItemList from '@/components/sidebar/LayerColor/color-elements/ColorItemList.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { updateFabricObjectsColor } from '@/utils/canvas';
import { updateColorItemColor } from '@/utils/layer-color-helpers.ts';
import { type Color, type ColorElement, type ColorItem, isLayerColor } from '@clab/types';
import { cn, findColorElementById } from '@clab/utils';
import { ArrowBigLeft } from 'lucide-react';
import React, { useMemo } from 'react';

type ColorElementViewProps = React.ComponentPropsWithoutRef<'div'>;

export default function ColorElementView({ className, ...props }: ColorElementViewProps) {
  const { performConfigurationUpdate, selectedElement, setSelectedElementId, currentLayer } =
    useConfigurator();

  if (selectedElement?.type !== 'color-element' || !isLayerColor(currentLayer)) return null;
  const { element: colorElement } = selectedElement;

  const parent: ColorElement | undefined = useMemo(
    () =>
      colorElement.parentId
        ? findColorElementById(currentLayer.colorElements, colorElement.parentId)
        : undefined,
    [colorElement, currentLayer]
  );

  function goBack() {
    setSelectedElementId(parent ? parent?.id : undefined);
  }

  function handleColorItemColorChange(colorItem: ColorItem, color: Color) {
    performConfigurationUpdate(
      (prev) => updateColorItemColor(prev, currentLayer!.id, colorItem.id, color),
      (canvas) => updateFabricObjectsColor(canvas, colorItem.id, color.value)
    );
  }

  const isAllColorItems =
    (colorElement.type === 'group' &&
      colorElement.subColorElements.every((colorElement) => colorElement.type === 'item')) ||
    colorElement.type === 'item';
  const colorItems = isAllColorItems
    ? colorElement.type === 'group'
      ? (colorElement.subColorElements as ColorItem[])
      : [colorElement]
    : [];

  const backButtonLabel = parent ? parent.name : currentLayer.name;
  const showColorElementName = colorElement.type !== 'item';

  return (
    <div className={cn('flex flex-col gap-3 p-2', className)} {...props}>
      {/* Back button */}
      <Button className="w-fit text-lg" variant="outline" onClick={goBack}>
        <ArrowBigLeft className="!h-5 !w-5" />
        {backButtonLabel}
      </Button>
      {/* Name */}
      {showColorElementName ? (
        <div className="py-2 text-center text-xl font-semibold">{colorElement.name}</div>
      ) : null}
      {/* Color elements */}
      <div className="-mx-2">
        {isAllColorItems ? (
          <ColorItemList
            key={colorElement.id}
            colorItems={colorItems}
            onColorItemColorChange={handleColorItemColorChange}
            config={{
              availableColors: currentLayer.config.availableColors,
              columns: currentLayer.config.columns,
              space: currentLayer.config.space,
            }}
          />
        ) : (
          <ColorElementList
            key={colorElement.id}
            colorElements={colorElement.subColorElements}
            onColorElementClick={(colorElement) => setSelectedElementId(colorElement.id)}
          />
        )}
      </div>
    </div>
  );
}
