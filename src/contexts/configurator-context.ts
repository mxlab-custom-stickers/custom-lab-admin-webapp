import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
import { createContext, useContext } from 'react';

type ConfiguratorContextType = {
  template: Template;
  setTemplate: (template: Template) => void;

  svgInjecting: boolean;
  setSvgInjecting: (svgInjecting: boolean) => void;

  currentLayer?: TemplateLayerColor;
  setCurrentLayer: (layer?: TemplateLayerColor) => void;

  // TODO: keep this here ?
  updateCurrentLayer: (layer: TemplateLayerColor) => void;

  currentColorElement?: ColorElement;
  setCurrentColorElement: (colorElement?: ColorElement) => void;
  updateCurrentColorElement: (updates: ColorElement) => void;
};

export const ConfiguratorContext = createContext<ConfiguratorContextType>(
  {} as ConfiguratorContextType
);

export const useConfiguratorContext = () => {
  return useContext(ConfiguratorContext);
};
