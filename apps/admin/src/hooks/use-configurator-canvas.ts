import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { getAllFabricObjectsFromTemplate } from '@/lib/configurator.ts';
import { hideOrShowObjectsById } from '@/lib/fabric.ts';
import { ColorItem, TemplateLayerColor } from '@/models/template.ts';

export const useConfiguratorCanvas = () => {
  const {
    state: { template, canvas },
  } = useTemplateEditorContext();

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
