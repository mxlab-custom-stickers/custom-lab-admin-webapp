import {
  makeColorItemNonInteractive,
  makeImageNonInteractive,
  makeTextNonInteractive,
} from '@/lib/fabric.ts';
import { Color } from '@/models/color.ts';
import { Image } from '@/models/image.ts';
import {
  ColorElement,
  ColorGroup,
  ColorItem,
  isTemplateLayerColor,
  isTemplateLayerImage,
  isTemplateLayerText,
  Template,
  TemplateLayerColor,
  TemplateLayerText,
} from '@/models/template.ts';
import { Text } from '@/models/text.ts';
import { FabricObject } from 'fabric';

/**
 * Resets interactivity on all color items and images
 * by making them non-interactive on the canvas.
 */
export function resetInteractivity(template: Template) {
  getAllColorItemsFromTemplate(template).forEach(makeColorItemNonInteractive);
  getAllImagesFromTemplate(template).forEach(makeImageNonInteractive);
  getAllTextsFromTemplate(template).forEach(makeTextNonInteractive);
}

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
        subColorElements: updateColorElementById(element.subColorElements, id, updateFn),
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
export function updateColorElementInTemplate(template: Template, updates: ColorElement): Template {
  const updatedLayers = template.layers.map((layer) => {
    if (layer.type !== 'color') return layer;

    const updatedColorElements = updateColorElementById(layer.colorElements, updates.id, (el) => ({
      ...el,
      ...updates,
    }));

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
 * Updates multiple images within the image layers of a template.
 *
 * For each image in the `updates` array, this function finds the matching image
 * (by `id`) in the image layers of the template and replaces it with the updated one.
 *
 * @param {Template} template - The template containing layers with images.
 * @param {Image[]} updates - An array of updated image objects to replace existing ones.
 * @returns {Template} - A new template object with the updated image layers.
 */
export function updateImagesInTemplate(template: Template, updates: Image[]): Template {
  const updatedLayers = template.layers.map((layer) => {
    if (layer.type !== 'image') return layer;

    return {
      ...layer,
      images: layer.images.map((img) => {
        const updated = updates.find((u) => u.id === img.id);
        return updated ?? img;
      }),
    };
  });

  return {
    ...template,
    layers: updatedLayers,
  };
}

/**
 * Updates multiple texts within the text layers of a template.
 *
 * For each text in the `updates` array, this function finds the matching text
 * (by `id`) in the text layers of the template and replaces it with the updated one.
 *
 * @param {Template} template - The template containing layers with texts.
 * @param {Text[]} updates - An array of updated text objects to replace existing ones.
 * @returns {Template} - A new template object with the updated text layers.
 */
export function updateTextsInTemplate(template: Template, updates: Text[]): Template {
  const updatedLayers = template.layers.map((layer) => {
    if (layer.type !== 'text') return layer;

    return {
      ...layer,
      texts: layer.texts.map((text) => {
        const updated = updates.find((u) => u.id === text.id);
        return updated ?? text;
      }),
    } satisfies TemplateLayerText;
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
export function getAllColorItemsFromLayer(layer: TemplateLayerColor): ColorItem[] {
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
export function getColorItemsByColor(layer: TemplateLayerColor, colorValue: string): ColorItem[] {
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

export function getAllImagesFromTemplate(template: Template): Image[] {
  return template.layers
    .filter(
      (
        layer
      ): layer is Template['layers'][number] & {
        type: 'image';
        images: Image[];
      } => layer.type === 'image'
    )
    .flatMap((layer) => layer.images);
}

export function getAllTextsFromTemplate(template: Template): Text[] {
  return template.layers
    .filter((layer): layer is TemplateLayerText => layer.type === 'text')
    .flatMap((textLayer) => textLayer.texts);
}

/**
 * Returns all FabricObjects from the template layers that match the given IDs.
 */
export function getAllFabricObjectsFromTemplate(
  template: Template,
  layerIds: string[]
): FabricObject[] {
  const result: FabricObject[] = [];

  for (const layer of template.layers) {
    if (!layerIds.includes(layer.id)) continue;

    if (isTemplateLayerColor(layer)) {
      const colorItems = collectColorItems(layer.colorElements);
      for (const colorItem of colorItems) {
        if (colorItem.fabricObjects) result.push(...colorItem.fabricObjects);
      }
    }

    if (isTemplateLayerText(layer)) {
      for (const text of layer.texts) {
        if (text.fabricText) result.push(text.fabricText);
      }
    }

    if (isTemplateLayerImage(layer)) {
      for (const image of layer.images) {
        if (image.fabricImage) result.push(image.fabricImage);
      }
    }
  }

  return result;
}
