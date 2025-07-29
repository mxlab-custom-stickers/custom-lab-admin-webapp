import type { Color, ColorElement, ColorItem, Configuration } from '@clab/types';

/**
 * Updates the color of a specific ColorItem within a given color layer of the configuration.
 *
 * This function returns a new configuration object with the updated color value
 * for the specified ColorItem. The update supports nested groups of ColorElements.
 *
 * @param config - The current configuration object.
 * @param layerId - The ID of the color layer containing the ColorItem.
 * @param itemId - The ID of the ColorItem whose color should be updated.
 * @param newColor - The new color to apply to the ColorItem.
 * @returns A new configuration object with the updated color value.
 */
export function updateColorItemColor(
  config: Configuration,
  layerId: string,
  itemId: string,
  newColor: Color
): Configuration {
  return {
    ...config,
    layers: config.layers.map((layer) => {
      if (layer.id !== layerId || layer.type !== 'color') return layer;

      const updateElements = (elements: typeof layer.colorElements): typeof layer.colorElements =>
        elements.map((el) => {
          if (el.type === 'group') {
            return {
              ...el,
              subColorElements: updateElements(el.subColorElements),
            };
          }
          if (el.type === 'item' && el.id === itemId) {
            return { ...el, color: newColor };
          }
          return el;
        });

      return {
        ...layer,
        colorElements: updateElements(layer.colorElements),
      };
    }),
  };
}

/**
 * Recursively collects all ColorItem elements from a ColorElement tree.
 *
 * @param elements - Array of ColorElements (group or item)
 * @returns An array of ColorItem objects found in the input tree
 */
export function collectColorItems(elements: ColorElement[]): ColorItem[] {
  return elements.flatMap((element) => {
    if (element.type === 'item') {
      return [element];
    } else if (element.type === 'group') {
      return collectColorItems(element.subColorElements);
    }
    return [];
  });
}
