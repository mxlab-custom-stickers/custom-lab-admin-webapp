import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { hideOrShowObjectsById } from '@/utils/fabric.ts';
import type { ColorItem, TemplateLayerColor } from '@clab/types';
import { getAllFabricObjectsFromTemplate } from '@clab/utils';

export const useCanvas = () => {
  const {
    state: { template, canvas },
  } = useConfiguratorContext();

  function setColorItemsColor(colorItems: ColorItem[]) {
    if (!canvas) return;

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

  return { setColorItemsColor, focusColorLayer };
};
