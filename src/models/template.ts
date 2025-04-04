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
export interface ColorElementBase {
  type: 'group' | 'item';
  id: string;
  name: string;
  parentId: string;
}

export interface ColorGroup extends ColorElementBase {
  type: 'group';
  subColorElements: ColorElement[];
}

export interface ColorItem extends ColorElementBase {
  type: 'item';
  color: Color;
}

export type ColorElement = ColorGroup | ColorItem;

export interface TemplateLayerColor extends TemplateLayerBase {
  type: 'color';

  colorElements: ColorElement[];

  config: {
    availableColors: Color[];
    availableColorPalettes: ColorPalette[];
  };
}
