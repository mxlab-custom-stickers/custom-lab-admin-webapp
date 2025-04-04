import { Color } from '@/models/color.ts';
import { SvgLayer } from '@/models/svg.ts';
import { ColorElement, ColorGroup } from '@/models/template.ts';

export function svgLayerToColorElements(svgLayer: SvgLayer): ColorElement[] {
  return svgLayer.children
    ? svgLayer.children.map((child) =>
        svgLayerToColorGroupOrColorElement(child, svgLayer.id)
      )
    : [];
}

function svgLayerToColorGroupOrColorElement(
  svgLayer: SvgLayer,
  parentId: string
): ColorElement {
  const base = {
    id: svgLayer.id,
    name: svgLayer.id,
  };

  if (svgLayer.color) {
    return {
      ...base,
      type: 'item',
      parentId,
      color: { id: '', name: '', value: svgLayer.color },
    };
  }

  return {
    ...base,
    type: 'group',
    parentId,
    subColorElements:
      svgLayer.children?.map((child) =>
        svgLayerToColorGroupOrColorElement(child, svgLayer.id)
      ) || [],
  };
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
