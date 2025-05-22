import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import {
  ConfiguratorAction,
  ConfiguratorState,
} from '@/contexts/configurator/configurator-types.ts';
import { ColorElement, Template } from '@/models/template.ts';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

export const ConfiguratorContext = createContext<{
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;

  // Current layer
  setCurrentLayerId: (currentLayerId: string | undefined) => void;
  // Current color element
  setCurrentColorElement: (
    currentColorElement: ColorElement | undefined
  ) => void;
  updateCurrentColorElement: (updates: ColorElement) => void;
} | null>(null);

export function ConfiguratorProvider({
  template,
  currentLayerId,
  children,
}: {
  template: Template;
  currentLayerId?: string;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(configuratorReducer, {
    template,
    currentLayerId: currentLayerId,
    currentColorElement: undefined,
  });

  useEffect(() => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, [template]);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayerId });
  }, [currentLayerId]);

  function setCurrentLayerId(currentLayer: string | undefined) {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayer });
  }

  function setCurrentColorElement(
    currentColorElement: ColorElement | undefined
  ) {
    dispatch({
      type: 'SET_CURRENT_COLOR_ELEMENT',
      payload: currentColorElement,
    });
  }

  function updateCurrentColorElement(updates: ColorElement) {
    dispatch({
      type: 'UPDATE_CURRENT_COLOR_ELEMENT',
      payload: updates,
    });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        dispatch,
        setCurrentLayerId,
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
