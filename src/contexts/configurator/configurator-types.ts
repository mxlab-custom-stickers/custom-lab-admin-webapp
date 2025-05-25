import { ColorItem, Template } from '@/models/template.ts';
import { Canvas, FabricObject } from 'fabric';

export type ConfiguratorState = {
  template: Template;
  currentLayerId: string | undefined;
  currentColorElementId: string | undefined;

  canvas?: Canvas;
  colorItemMap: Map<ColorItem, FabricObject[]>;
};

export type ConfiguratorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_CURRENT_LAYER_ID'; payload: string | undefined }
  | { type: 'SET_CURRENT_COLOR_ELEMENT_ID'; payload: string | undefined }
  | { type: 'SET_CANVAS'; payload: Canvas }
  | { type: 'SET_COLOR_ITEM_MAP'; payload: Map<ColorItem, FabricObject[]> };
