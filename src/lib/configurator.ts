import { Color } from '@/models/color.ts';
import {
  ColorElement,
  ColorGroup,
  ColorItem,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';

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
    if (element.id === id) {
      return updateFn(element);
    } else if (element.type === 'group') {
      return {
        ...element,
        subColorElements: updateColorElementById(
          element.subColorElements,
          id,
          updateFn
        ),
      };
    }
    return element;
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
 * Updates the specified ColorItems in a TemplateLayerColor.
 *
 * @param layer - The original TemplateLayerColor
 * @param updatedItems - Array of ColorItem instances with updated values
 * @returns A new TemplateLayerColor with updated color items
 */
export function updateColorItemsInLayer(
  layer: TemplateLayerColor,
  updatedItems: ColorItem[]
): TemplateLayerColor {
  const updatedIds = new Set(updatedItems.map((item) => item.id));

  const updateElements = (elements: ColorElement[]): ColorElement[] =>
    elements.map((el) => {
      if (el.type === 'item' && updatedIds.has(el.id)) {
        const updated = updatedItems.find((item) => item.id === el.id);
        return updated ?? el;
      } else if (el.type === 'group') {
        return {
          ...el,
          subColorElements: updateElements(el.subColorElements),
        };
      }
      return el;
    });

  return {
    ...layer,
    colorElements: updateElements(layer.colorElements),
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

/**
 * Recursively collects all ColorItem elements from a TemplateLayerColor.
 *
 * @param layer - The TemplateLayerColor to extract ColorItems from
 * @returns An array of ColorItem objects found in the layer
 */
export function getAllColorItemsFromLayer(
  layer: TemplateLayerColor
): ColorItem[] {
  return collectColorItems(layer.colorElements);
}

/**
 * Returns all unique colors used in a TemplateLayerColor.
 * Recursively traverses the color elements.
 *
 * @param layer - The TemplateLayerColor to extract colors from
 * @returns An array of unique Color objects
 */
export function getUniqueColorsFromLayer(layer: TemplateLayerColor): Color[] {
  const colorMap = new Map<string, Color>();

  const collectColors = (elements: typeof layer.colorElements) => {
    for (const element of elements) {
      if (element.type === 'item') {
        const key = element.color.value.toLowerCase();
        if (!colorMap.has(key)) {
          colorMap.set(key, element.color);
        }
      } else if (element.type === 'group') {
        collectColors(element.subColorElements);
      }
    }
  };

  collectColors(layer.colorElements);

  return Array.from(colorMap.values());
}

/**
 * Recursively collects all ColorItems from a layer that match the given color.
 *
 * @param layer - The TemplateLayerColor to search within
 * @param colorValue - The hex color string to match (e.g., "#FFFFFF")
 * @returns An array of matching ColorItem objects
 */
export function getColorItemsByColor(
  layer: TemplateLayerColor,
  colorValue: string
): ColorItem[] {
  const result: ColorItem[] = [];

  const search = (elements: ColorElement[]) => {
    for (const element of elements) {
      if (element.type === 'item') {
        if (element.color.value.toLowerCase() === colorValue.toLowerCase()) {
          result.push(element);
        }
      } else if (element.type === 'group') {
        search(element.subColorElements);
      }
    }
  };

  search(layer.colorElements);

  return result;
}
