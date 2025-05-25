import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
import { Canvas } from 'fabric';

export type ConfiguratorState = {
  template: Template;
  currentLayer?: TemplateLayerColor;
  currentColorElement?: ColorElement;

  canvas?: Canvas;
};

export type ConfiguratorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_CURRENT_COLOR_ELEMENT'; payload: ColorElement | undefined };
