import { SvgLayer } from '@/models/svg.ts';
import { ColorElement } from '@/models/template.ts';

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
