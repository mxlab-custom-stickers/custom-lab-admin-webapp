import ColorElementList from '@/components/sidebar/LayerColor/color-elements/ColorElementList.tsx';
import ColorItemList from '@/components/sidebar/LayerColor/color-elements/ColorItemList.tsx';
import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { updateFabricObjectsColor } from '@/utils/canvas';
import { updateColorItemColor } from '@/utils/layer-color-helpers.ts';
import { type Color, type ColorItem, isLayerColor } from '@clab/types';

export default function LayerColorView() {
  const { performConfigurationUpdate, currentLayer, setSelectedElementId } = useConfigurator();

  if (!isLayerColor(currentLayer)) return null;

  const { colorElements } = currentLayer;
  const isAllColorItems = colorElements.every((colorElement) => colorElement.type === 'item');

  function handleColorItemColorChange(colorItem: ColorItem, color: Color) {
    performConfigurationUpdate(
      (prev) => updateColorItemColor(prev, currentLayer!.id, colorItem.id, color),
      (canvas) => updateFabricObjectsColor(canvas, colorItem.id, color.value)
    );
  }

  return isAllColorItems ? (
    <ColorItemList
      colorItems={colorElements}
      onColorItemColorChange={handleColorItemColorChange}
      config={{
        availableColors: currentLayer.config.availableColors,
        columns: currentLayer.config.columns,
        space: currentLayer.config.space,
      }}
    />
  ) : (
    <ColorElementList
      colorElements={currentLayer.colorElements}
      onColorElementClick={(colorElement) => setSelectedElementId(colorElement.id)}
    />
  );
}
