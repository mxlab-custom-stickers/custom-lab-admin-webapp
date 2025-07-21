import ColorElementList from '@/components/sidebar/LayerColor/color-elements/ColorElementList.tsx';
import ColorItemList from '@/components/sidebar/LayerColor/color-elements/ColorItemList.tsx';
import LayerHeader from '@/components/sidebar/LayerHeader.tsx';
import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { useCanvas } from '@/hooks/use-canvas.ts';
import { type Color, type ColorItem, isLayerColor } from '@clab/types';

export default function LayerColorView() {
  const { currentLayer, setSelectedObjectId } = useConfiguratorContext();
  const {} = useCanvas();

  if (!isLayerColor(currentLayer)) return null;

  const { colorElements } = currentLayer;
  const isAllColorItems = colorElements.every((colorElement) => colorElement.type === 'item');

  function handleColorItemColorChange(colorItem: ColorItem, color: Color) {}

  return (
    <div className="flex flex-col gap-2">
      <LayerHeader layer={currentLayer} />

      {isAllColorItems ? (
        <ColorItemList
          colorItems={colorElements}
          onColorItemColorChange={handleColorItemColorChange}
        />
      ) : (
        <ColorElementList
          colorElements={currentLayer.colorElements}
          onColorElementClick={(colorElement) => setSelectedObjectId(colorElement.id)}
        />
      )}
    </div>
  );
}
