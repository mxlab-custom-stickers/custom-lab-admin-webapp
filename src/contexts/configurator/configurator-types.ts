import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';

export type ConfiguratorState = {
  template: Template;
  svgInjecting: boolean;
  currentLayer?: TemplateLayerColor;
  currentColorElement?: ColorElement;
};

export type ConfiguratorAction =
  | {
      type: 'SET_SVG_INJECTING';
      payload: boolean;
    }
  | {
      type: 'SET_CURRENT_LAYER';
      payload: TemplateLayerColor | undefined;
    }
  | {
      type: 'SET_CURRENT_COLOR_ELEMENT';
      payload: ColorElement | undefined;
    }
  | {
      type: 'UPDATE_TEMPLATE';
      payload: Template;
    }
  | {
      type: 'UPDATE_CURRENT_LAYER';
      payload: TemplateLayerColor;
    }
  | {
      type: 'UPDATE_CURRENT_COLOR_ELEMENT';
      payload: ColorElement;
    };
