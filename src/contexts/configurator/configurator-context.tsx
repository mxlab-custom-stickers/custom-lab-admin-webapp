import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import {
  ConfiguratorAction,
  ConfiguratorState,
} from '@/contexts/configurator/configurator-types.ts';
import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
import React, { createContext, useContext, useReducer } from 'react';

export const ConfiguratorContext = createContext<{
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;

  setSvgInjecting: (svgInjecting: boolean) => void;

  updateTemplate: (updates: Template) => void;
  // Current layer
  setCurrentLayer: (currentLayer: TemplateLayerColor | undefined) => void;
  updateCurrentLayer: (currentLayer: TemplateLayerColor) => void;
  // Current color element
  setCurrentColorElement: (
    currentColorElement: ColorElement | undefined
  ) => void;
  updateCurrentColorElement: (currentColorElement: ColorElement) => void;
} | null>(null);

export function ConfiguratorProvider({
  template,
  children,
}: {
  template: Template;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(configuratorReducer, {
    template,
    svgInjecting: true,
    currentLayer: undefined,
    currentColorElement: undefined,
  });

  function setSvgInjecting(svgInjecting: boolean) {
    dispatch({ type: 'SET_SVG_INJECTING', payload: svgInjecting });
  }

  function updateTemplate(updates: Template) {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: updates });
  }

  function setCurrentLayer(currentLayer: TemplateLayerColor | undefined) {
    dispatch({ type: 'SET_CURRENT_LAYER', payload: currentLayer });
  }

  function updateCurrentLayer(currentLayer: TemplateLayerColor) {
    dispatch({ type: 'UPDATE_CURRENT_LAYER', payload: currentLayer });
  }

  function setCurrentColorElement(
    currentColorElement: ColorElement | undefined
  ) {
    dispatch({
      type: 'SET_CURRENT_COLOR_ELEMENT',
      payload: currentColorElement,
    });
  }

  function updateCurrentColorElement(currentColorElement: ColorElement) {
    dispatch({
      type: 'UPDATE_CURRENT_COLOR_ELEMENT',
      payload: currentColorElement,
    });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        dispatch,
        setSvgInjecting,
        updateTemplate,
        setCurrentLayer,
        updateCurrentLayer,
        setCurrentColorElement,
        updateCurrentColorElement,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
}

export const useConfiguratorContext = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error(
      'useConfiguratorContext must be used inside ConfiguratorProvider'
    );
  }
  return context;
};
