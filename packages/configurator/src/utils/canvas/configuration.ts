import { updateFabricObjectsColor } from '@/utils/canvas/color.ts';
import { activateImage, drawImage } from '@/utils/canvas/image.ts';
import { collectColorItems } from '@/utils/layer-color-helpers.ts';
import {
  type Configuration,
  type Image,
  type TemplateLayerColor,
  type TemplateLayerImage,
} from '@clab/types';
import { adjustHexColorForHighlight } from '@clab/utils';
import type { Canvas } from 'fabric';

export async function applyConfigurationToCanvas(canvas: Canvas, configuration: Configuration) {
  for (const layer of configuration.layers) {
    switch (layer.type) {
      case 'color':
        const colorItems = collectColorItems(layer.colorElements);
        colorItems.forEach((colorItem) =>
          updateFabricObjectsColor(canvas, colorItem.id, colorItem.color.value)
        );
        break;
      case 'image':
        // Remove existing images in the layer before drawing new ones
        canvas
          .getObjects()
          .filter((obj) => obj.get('layerId') === layer.id)
          .forEach((obj) => canvas.remove(obj));
        canvas.requestRenderAll();
        await Promise.all(layer.images.map((image) => drawImage(canvas, image)));
        break;
      case 'text':
        break;
    }
  }
}

export function deactivateFabricObjectsInConfigurationByLayerIds(
  canvas: Canvas,
  config: Configuration,
  layerIds: string[]
): void {
  config.layers
    .filter((layer) => layerIds.includes(layer.id))
    .forEach((layer) => {
      switch (layer.type) {
        case 'color':
          deactivateFabricObjectsInLayerColor(canvas, layer as TemplateLayerColor);
          break;
        case 'image':
          deactivateFabricObjectsInLayerImage(canvas, layer as TemplateLayerImage);
          break;
        case 'text':
          // deactivateFabricObjectsInLayerText(canvas, layer as TemplateLayerText, callbacks);
          break;
      }
    });
}

export function activateFabricObjectsInLayerColor(
  canvas: Canvas,
  layer: TemplateLayerColor,
  onMouseDown: (colorItemId: string) => void
): void {
  console.debug(`Activating fabric objects in layer color '${layer.id}'`);
  const colorItems = collectColorItems(layer.colorElements);
  colorItems.forEach((colorItem) => {
    const objects = canvas.getObjects().filter((obj) => obj.get('id') === colorItem.id);
    objects.forEach((obj) => {
      obj.set({
        evented: true,
        perPixelTargetFind: true,
        targetFindTolerance: 0,
        hoverCursor: 'pointer',
      });

      const hoverColor = adjustHexColorForHighlight(colorItem.color.value, 0.23);

      obj.on('mouseover', () => {
        objects.forEach((_obj) => {
          _obj.set('fill', hoverColor);
        });
        canvas.requestRenderAll();
      });

      obj.on('mouseout', () => {
        objects.forEach((_obj) => {
          _obj.set('fill', colorItem.color.value);
        });
        canvas.requestRenderAll();
      });

      obj.on('mousedown', () => {
        onMouseDown(colorItem.id);
      });
    });
  });
}

export function deactivateFabricObjectsInLayerColor(canvas: Canvas, layer: TemplateLayerColor) {
  console.debug(`Deactivating fabric objects in layer color '${layer.id}'`);
  const colorItems = collectColorItems(layer.colorElements);
  colorItems.forEach((colorItem) => {
    const objects = canvas.getObjects().filter((obj) => obj.get('id') === colorItem.id);
    objects.forEach((obj) => {
      obj.set({
        evented: false,
        perPixelTargetFind: false,
        targetFindTolerance: 0,
        hoverCursor: 'default',
      });

      obj.off();
    });
  });
}

export function activateFabricObjectsInLayerImage(
  canvas: Canvas,
  layer: TemplateLayerImage,
  callbacks: { onModified: (modifiedImage: Image) => void }
): void {
  console.debug(`Activating fabric objects in layer image '${layer.id}'`);
  layer.images.forEach((image) => activateImage(canvas, image, callbacks));
}

export function deactivateFabricObjectsInLayerImage(
  canvas: Canvas,
  layer: TemplateLayerImage
): void {
  console.debug(`Deactivating fabric objects in layer image '${layer.id}'`);
  layer.images.forEach((image) => {
    const object = canvas.getObjects().find((obj) => obj.get('id') === image.id);
    if (!object) {
      console.error(`Can't deactivate object with id '${image.id}': not found on canvas`);
      return;
    }

    object.set({
      selectable: false,
      evented: false,
    });

    object.off();
  });
}
