import { Color } from '@/models/color.ts';
import { SvgLayer } from '@/models/svg.ts';
import {
  ColorElement,
  ColorGroup,
  TemplateLayerColor,
} from '@/models/template.ts';

export function svgLayerToTemplateLayerColor(
  svgLayer: SvgLayer
): TemplateLayerColor {
  return {
    id: svgLayer.id,
    name: svgLayer.id,
    order: 1,
    type: 'color',
    colors: svgLayer.children?.length
      ? svgLayer.children.map(svgLayerToColorGroupOrColorElement)
      : [],
    config: {
      allowedColors: [],
      allowedColorPalettes: [],
    },
  };
}

function svgLayerToColorGroupOrColorElement(
  svgLayer: SvgLayer
): ColorGroup | ColorElement {
  const base = {
    id: svgLayer.id,
    name: svgLayer.id,
  };

  if (svgLayer.color) {
    return {
      ...base,
      type: 'element',
      color: { id: '', name: '', value: svgLayer.color },
    };
  }

  return {
    ...base,
    type: 'group',
    children: svgLayer.children?.map(svgLayerToColorGroupOrColorElement) || [],
  };
}

export function getAllColorGroupColors(colorGroup: ColorGroup): Color[] {
  return colorGroup.children.reduce<Color[]>((acc, child) => {
    if (child.type === 'element') {
      return [...acc, child.color];
    }
    return [...acc, ...getAllColorGroupColors(child)];
  }, []);
}
