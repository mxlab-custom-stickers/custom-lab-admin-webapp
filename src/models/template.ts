import { Color } from '@/models/color.ts';
import { FabricObject } from 'fabric';

export interface Template {
  appId: string;

  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';

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

export const templateLayerTypes: Record<TemplateLayerType, string> = {
  color: 'Couleur',
  image: 'Image',
  text: 'Texte',
  background: 'Arrière plan',
};

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
  parentId?: string;
}

export interface ColorGroup extends ColorElementBase {
  type: 'group';
  subColorElements: ColorElement[];
}

export interface ColorItem extends ColorElementBase {
  type: 'item';
  color: Color;

  fabricObjects?: FabricObject[];
}

export type ColorElement = ColorGroup | ColorItem;

export interface TemplateLayerColor extends TemplateLayerBase {
  type: 'color';

  colorElements: ColorElement[];

  config: {
    availableColors: Color[];
    columns: number;
    space: number;
    enableColorPalette: boolean;
    focus: {
      enable: boolean;
      message: string;
      layerIdsToHide: string[];
    };
  };
}
