import { Color } from '@/models/color.ts';
import { Image } from '@/models/image.ts';
import { FabricObject } from 'fabric';

export interface Template {
  appId: string;

  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';

  svgUrl: string;
  layers: TemplateLayer[];

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
export type TemplateLayer =
  | TemplateLayerColor
  | TemplateLayerImage
  | TemplateLayerText;

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

/**
 * TemplateLayerImage
 */
export interface TemplateLayerImage extends TemplateLayerBase {
  type: 'image';

  images: Image[];

  config: {
    availableImages: { url: string }[];
    allowImport: boolean;
    clipWithLayerId: string | null; // Optional, used for clipping the image with another layer
    allowStretch: boolean; // Whether the image can be stretched
  };
}

/**
 * TemplateLayerText
 */
export interface TemplateLayerText extends TemplateLayerBase {
  type: 'text';

  texts: Text[];

  config: {
    availableFonts: string[];
    availableColors: Color[];
  };
}
