import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';

export type ConfiguratorState = {
  template: Template;
  currentLayer?: TemplateLayerColor;
  currentColorElement?: ColorElement;
};

export type ConfiguratorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_CURRENT_COLOR_ELEMENT'; payload: ColorElement | undefined };
