import { ColorElement, Template } from '@/models/template.ts';

export type ConfiguratorState = {
  template: Template;
  currentLayerId?: string;
  currentColorElement?: ColorElement;
};

export type ConfiguratorAction =
  | {
      type: 'SET_TEMPLATE';
      payload: Template;
    }
  | {
      type: 'SET_CURRENT_LAYER_ID';
      payload: string | undefined;
    }
  | {
      type: 'SET_CURRENT_COLOR_ELEMENT';
      payload: ColorElement | undefined;
    }
  | {
      type: 'UPDATE_CURRENT_COLOR_ELEMENT';
      payload: ColorElement;
    };
