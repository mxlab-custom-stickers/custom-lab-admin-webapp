import { PartialBy } from '@/lib/utils.ts';
import { Color, ColorPalette } from '@/models/color.ts';

export interface Template {
  id: string;
  name: string;
  description?: string;

  svgUrl: string;
  layers: TemplateLayerColor[];

  tags: string[];
  attributes: {
    key: string;
    value: string;
  }[];

  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export type EditTemplate = PartialBy<
  Template,
  'svgUrl' | 'createdAt' | 'createdBy'
>;

export type TemplateLayerType = 'color' | 'image' | 'text' | 'background';

export interface TemplateLayerBase {
  id: string;
  name: string;

  order: number;
  message?: string;

  type: TemplateLayerType;
}

/**
 * TemplateLayerColor
 */
export interface ColorGroup {
  type: 'group';
  id: string;
  name: string;

  children: (ColorGroup | ColorElement)[];
}

export interface ColorElement {
  type: 'element';
  id: string;
  name: string;

  color: Color;
}

export interface TemplateLayerColor extends TemplateLayerBase {
  type: 'color';

  color?: Color;
  colors?: (ColorGroup | ColorElement)[];

  config: {
    allowedColors: Color[];
    allowedColorPalettes: ColorPalette[];
  };
}
