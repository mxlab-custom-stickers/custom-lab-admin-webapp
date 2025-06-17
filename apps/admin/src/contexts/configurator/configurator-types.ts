import { ColorElement, Template } from '@/models/template.ts';
import { Canvas } from 'fabric';

export type ConfiguratorState = {
  template: Template;
  currentLayerId: string | undefined;

  currentColorElementId: string | undefined;
  currentTextId: string | undefined;

  canvas?: Canvas;
};

export type ConfiguratorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_CURRENT_LAYER_ID'; payload: string | undefined }
  | { type: 'SET_CURRENT_COLOR_ELEMENT_ID'; payload: string | undefined }
  | { type: 'SET_CURRENT_TEXT_ID'; payload: string | undefined }
  | { type: 'SET_CANVAS'; payload: Canvas };

export type CurrentColorElement =
  | ColorElement
  | { id: 'color-palette'; type: 'color-palette'; parentId: undefined }
  | undefined;

export type CurrentColorElementType = ColorElement['type'] | 'color-palette';
