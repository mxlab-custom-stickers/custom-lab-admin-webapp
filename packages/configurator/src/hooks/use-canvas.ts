import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { hideOrShowObjectsById } from '@/lib/fabric.ts';
import type { ColorItem, TemplateLayerColor } from '@clab/types';
import { getAllFabricObjectsFromTemplate } from '@clab/utils';
import { type Textbox } from 'fabric';

export const useCanvas = () => {
  const {
    state: { template, canvas },
  } = useConfiguratorContext();

  function setColorItemsColor(colorItems: ColorItem[]) {
    if (!canvas) return;

    console.log(colorItems);

    colorItems.forEach((colorItem) => {
      colorItem.fabricObjects?.forEach((fabricObject) => {
        fabricObject.set('fill', colorItem.color.value);
      });
    });
    canvas.requestRenderAll();
  }

  function focusColorLayer(layer: TemplateLayerColor, isFocusing: boolean) {
    if (!canvas) return;

    const ids = getAllFabricObjectsFromTemplate(template, layer.config.focus.layerIdsToHide).map(
      (obj) => obj.get('id')
    );

    hideOrShowObjectsById(canvas, ids, isFocusing);
  }

  function updateFabricText(fabricText: Textbox, updates: Partial<Textbox>) {
    if (!fabricText || !canvas) return;
    fabricText.set(updates);
    canvas.requestRenderAll();
  }

  return { setColorItemsColor, focusColorLayer, updateFabricText };
};
