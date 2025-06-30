import { useConfiguratorContext } from '@/contexts/configurator-contexts.tsx';
import { hideOrShowObjectsById } from '@/lib/fabric.ts';
import type { ColorItem, TemplateLayerColor } from '@clab/types';
import { getAllFabricObjectsFromTemplate } from '@clab/utils';
import { type FabricImage, type FabricObject, type Textbox } from 'fabric';

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

  function updateFabricText(fabricText: Textbox, updates: Partial<Textbox>) {
    if (!canvas) return;
    fabricText.set(updates);
    canvas.requestRenderAll();
  }

  function updateFabricImage(fabricImage: FabricImage, updates: Partial<FabricImage>) {
    if (!canvas) return;
    fabricImage.set(updates);
    canvas.requestRenderAll();
  }

  function removeFabricObject(obj: FabricObject) {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.requestRenderAll();
  }

  function lockFabricObject(obj: FabricObject, locked: boolean) {
    if (!canvas) return;
    obj.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      lockRotation: locked,
      editable: !locked,
    });
    canvas.requestRenderAll();
  }

  return {
    setColorItemsColor,
    focusColorLayer,
    updateFabricText,
    updateFabricImage,
    removeFabricObject,
    lockFabricObject,
  };
};
