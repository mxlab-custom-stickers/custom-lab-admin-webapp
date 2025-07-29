import { updateFabricObjectsColor } from '@/utils/canvas/color.ts';
import { collectColorItems } from '@/utils/layer-color-helpers.ts';
import type { Configuration } from '@clab/types';
import type { Canvas } from 'fabric';

export function applyConfigurationToCanvas(canvas: Canvas, configuration: Configuration): void {
  for (const layer of configuration.layers) {
    switch (layer.type) {
      case 'color':
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
