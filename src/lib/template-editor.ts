import { SvgLayer } from '@/models/svg-editor.ts';
import { ColorElement } from '@/models/template.ts';

export function svgLayerToColorElement(svgLayer: SvgLayer): ColorElement {
  const base = {
    id: svgLayer.id,
    name: svgLayer.id,
  };

  if (svgLayer.color) {
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
