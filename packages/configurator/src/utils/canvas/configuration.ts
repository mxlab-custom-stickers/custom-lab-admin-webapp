import { updateFabricObjectsColor } from '@/utils/canvas/color.ts';
import { collectColorItems } from '@/utils/layer-color-helpers.ts';
import type { Configuration, TemplateLayerColor } from '@clab/types';
import { adjustHexColorForHighlight } from '@clab/utils';
import type { Canvas } from 'fabric';

export function applyConfigurationToCanvas(canvas: Canvas, configuration: Configuration): void {
  for (const layer of configuration.layers) {
    switch (layer.type) {
      case 'color':
        // TODO: Move this logic to a separate function
        const colorItems = collectColorItems(layer.colorElements);
        colorItems.forEach((colorItem) =>
          updateFabricObjectsColor(canvas, colorItem.id, colorItem.color.value)
        );
        break;
      case 'image':
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
          // deactivateFabricObjectsInLayerImage(canvas, layer as TemplateLayerImage, callbacks);
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
