import { ColorElement, Template } from '@clab/types';

/**
 * Removes all `fabricObjects` from each ColorItem
 * and `fabricImage` from each Image in a Template.
 * and `fabricText` from each Text in a Template.
 * Intended to be used before saving the template to a database.
 *
 * @param template - The Template to clean
 * @returns A new Template with all transient Fabric data removed
 */
export function stripFabricObjectsFromTemplate(template: Template): Template {
  const cleanColorElements = (elements: ColorElement[]): ColorElement[] => {
    return elements.map((el) => {
      if (el.type === 'group') {
        return {
          ...el,
          subColorElements: cleanColorElements(el.subColorElements),
        };
      }

      if (el.type === 'item') {
        const { fabricObjects, ...rest } = el;
        return rest; // Return ColorItem without fabricObjects
      }

      return el;
    });
  };

  const cleanedLayers = template.layers.map((layer) => {
    if (layer.type === 'color') {
      return {
        ...layer,
        colorElements: cleanColorElements(layer.colorElements),
      };
    }

    if (layer.type === 'image') {
      return {
        ...layer,
        images: layer.images.map(({ fabricImage, ...img }) => img),
      };
    }

    if (layer.type === 'text') {
      return {
        ...layer,
        texts: layer.texts.map(({ fabricTextbox, ...text }) => text),
      };
    }

    return layer;
  });

  return {
    ...template,
    layers: cleanedLayers,
  };
}
