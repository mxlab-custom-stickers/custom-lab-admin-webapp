import { SvgLayer } from '@/models/svg-editor.ts';
import { ColorElement, Template } from '@/models/template.ts';

export function svgLayerToColorElement(svgLayer: SvgLayer): ColorElement {
  const base = {
    id: svgLayer.id,
    name: svgLayer.id,
  };

  if (svgLayer.color && svgLayer.color !== 'none') {
    return {
      ...base,
      type: 'item',
      parentId: svgLayer.parentId,
      color: { id: '', name: '', value: svgLayer.color },
    };
  }

  return {
    ...base,
    type: 'group',
    parentId: svgLayer.parentId,
    subColorElements:
      svgLayer.children?.map((child) => svgLayerToColorElement(child)) || [],
  };
}

/**
 * Removes all `fabricObjects` from each ColorItem in a Template.
 * Intended to be used before saving the template to a database.
 *
 * @param template - The Template to clean
 * @returns A new Template with all `fabricObjects` properties removed from ColorItems
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
    if (layer.type !== 'color') return layer;

    return {
      ...layer,
      colorElements: cleanColorElements(layer.colorElements),
    };
  });

  return {
    ...template,
    layers: cleanedLayers,
  };
}
