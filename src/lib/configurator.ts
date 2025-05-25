import { Color } from '@/models/color.ts';
import {
  ColorElement,
  ColorGroup,
  ColorItem,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
import { FabricObject } from 'fabric';

export function getAllColorGroupColors(colorGroup: ColorGroup): Color[] {
  return colorGroup.subColorElements.reduce<Color[]>((acc, child) => {
    if (child.type === 'item') {
      return [...acc, child.color];
    }
    return [...acc, ...getAllColorGroupColors(child)];
  }, []);
}

export function findColorElementById(
  colorElements: ColorElement[],
  id: string
): ColorElement | undefined {
  for (const element of colorElements) {
    if (element.id === id) {
      return element;
    }
    if (element.type === 'group') {
      const found = findColorElementById(element.subColorElements, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * Recursively updates a ColorElement by id inside a list.
 */
export function updateColorElementById(
  elements: ColorElement[],
  id: string,
  updateFn: (element: ColorElement) => ColorElement
): ColorElement[] {
  return elements.map((element) => {
    if (element.type === 'group') {
      return {
        ...element,
        subColorElements: updateColorElementById(
          element.subColorElements,
          id,
          updateFn
        ),
      };
    }

    return element.id === id ? updateFn(element) : element;
  });
}

/**
 * Update a ColorElement by its id within a Template.
 *
 * @param template - The template to update
 * @param updates - The updated ColorElement
 * @returns A new Template with the updated ColorElement
 */
export function updateColorElementInTemplate(
  template: Template,
  updates: ColorElement
): Template {
  const updatedLayers = template.layers.map((layer) => {
    if (layer.type !== 'color') return layer;

    const updatedColorElements = updateColorElementById(
      layer.colorElements,
      updates.id,
      (el) => ({ ...el, ...updates })
    );

    return {
      ...layer,
      colorElements: updatedColorElements,
    };
  });

  return {
    ...template,
    layers: updatedLayers,
  };
}

/**
 * Updates a ColorItem in the ColorItem-to-FabricObject[] map.
 *
 * @param colorItemMap - The current Map of ColorItems to FabricObject arrays
 * @param updatedElement - The updated ColorElement
 * @returns A new Map with the ColorItem key updated (if applicable)
 */
export function updateColorItemMap(
  colorItemMap: Map<ColorItem, FabricObject[]>,
  updatedElement: ColorElement
): Map<ColorItem, FabricObject[]> {
  if (updatedElement.type !== 'item') {
    return colorItemMap;
  }

  const newMap = new Map<ColorItem, FabricObject[]>();

  for (const [item, objects] of colorItemMap.entries()) {
    if (item.id === updatedElement.id) {
      newMap.set(updatedElement, objects); // replace key with updated item
    } else {
      newMap.set(item, objects);
    }
  }

  return newMap;
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

/**
 * Retrieves all ColorItem elements from a Template object.
 *
 * @param template - The Template containing multiple layers
 * @returns An array of all ColorItem objects found in the template
 */
export function getAllColorItemsFromTemplate(template: Template): ColorItem[] {
  return template.layers
    .filter((layer): layer is TemplateLayerColor => layer.type === 'color')
    .flatMap((layer) => collectColorItems(layer.colorElements));
}
