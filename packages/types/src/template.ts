import type { FabricObject } from 'fabric';
import { Color } from './color';
import { Image } from './image';
import { Font, Text } from './text';

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

/**
 * Template Layer
 */
export type TemplateLayerType = 'color' | 'image' | 'text' | 'background';
export type TemplateLayer = TemplateLayerColor | TemplateLayerImage | TemplateLayerText;

export const templateLayerTypeLabels: Record<TemplateLayerType, string> = {
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
    availableFonts: Font[];
    availableColors: Color[];
  };
}

/**
 * Type guard for ColorElement
 */
export function isColorElement(element: any): element is ColorElement {
  return (
    typeof element === 'object' &&
    element !== null &&
    (element.type === 'group' || element.type === 'item') &&
    typeof element.id === 'string' &&
    typeof element.name === 'string'
  );
}

/**
 * Type guard for TemplateLayerColor
 */
export function isLayerColor(layer: TemplateLayer | undefined): layer is TemplateLayerColor {
  return !!layer && layer.type === 'color';
}

/**
 * Type guard for TemplateLayerImage
 */
export function isLayerImage(layer: TemplateLayer | undefined): layer is TemplateLayerImage {
  return !!layer && layer.type === 'image';
}

/**
 * Type guard for TemplateLayerText
 */
export function isLayerText(layer: TemplateLayer | undefined): layer is TemplateLayerText {
  return !!layer && layer.type === 'text';
}
