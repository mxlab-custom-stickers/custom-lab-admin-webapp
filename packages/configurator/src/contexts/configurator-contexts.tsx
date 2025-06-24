import { configuratorReducer } from '@/contexts/configurator-reducer.ts';
import type {
  ConfiguratorContextType,
  ConfiguratorState,
  CurrentColorElement,
} from '@/contexts/configurator-types.ts';
import type { ColorElement, Template, TemplateLayer, Text } from '@clab/types';
import {
  findColorElementById,
  updateColorElementInTemplate,
  updateTextsInTemplate,
} from '@clab/utils';
import type { Canvas } from 'fabric';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export const ConfiguratorContext = createContext<ConfiguratorContextType | null>(null);

type ConfiguratorProviderProps = {
  className?: string;
  template: Template;
  currentLayerId?: string;
  children: React.ReactNode;
};

export function ConfiguratorProvider({
  className,
  template,
  currentLayerId: currentLayerIdProp,
  children,
}: ConfiguratorProviderProps) {
  const [state, dispatch] = useReducer(configuratorReducer, {
    template,
    currentLayerId: template.layers[0]?.id || undefined,
    currentColorElementId: undefined,
    currentTextId: undefined,
    canvas: undefined,
  } as ConfiguratorState);

  const currentLayer = useMemo(
    () => state.template.layers.find((l) => l.id === state.currentLayerId),
    [state.template, state.currentLayerId]
  );

  const currentColorElement: CurrentColorElement = useMemo(() => {
    if (!currentLayer || currentLayer.type !== 'color' || !state.currentColorElementId)
      return undefined;

    if (state.currentColorElementId === 'color-palette') {
      return {
        id: 'color-palette',
        type: 'color-palette',
        parentId: undefined,
      };
    }

    return findColorElementById(currentLayer.colorElements, state.currentColorElementId);
  }, [currentLayer, state.currentColorElementId]);

  const currentText: Text | undefined = useMemo(() => {
    if (!currentLayer || currentLayer.type !== 'text') return undefined;
    return currentLayer.texts.find((t) => t.id === state.currentTextId);
  }, [currentLayer, state.currentTextId]);

  useEffect(() => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, [template]);

  useEffect(() => {
    if (currentLayerIdProp) {
      dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayerIdProp });
    }
  }, [currentLayerIdProp]);

  function updateTemplate(template: Template) {
    console.log(template);
    // if (templateEditorContext) {
    //   templateEditorContext.updateTemplate(template);
    // } else {
    //   dispatch({ type: 'SET_TEMPLATE', payload: template });
    // }
  }

  function setCurrentLayerId(layerId: string | undefined) {
    // if (templateEditorContext) {
    //   templateEditorContext.setCurrentLayerId(layerId);
    // } else {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
    // }
    // dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT_ID', payload: undefined });
  }

  function updateLayer(layer: TemplateLayer) {
    console.log(layer);
    // const updatedTemplate = {
    //   ...state.template,
    //   layers: state.template.layers.map((l) => (l.id === layer.id ? { ...l, ...layer } : l)),
    // };
    //
    // if (templateEditorContext) {
    //   templateEditorContext.updateTemplate(updatedTemplate);
    // } else {
    //   dispatch({ type: 'SET_TEMPLATE', payload: updatedTemplate });
    // }
  }

  function setCurrentColorElementId(colorElementId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT_ID', payload: colorElementId });
  }

  /**
   * Update a ColorElement by its id within a Template.
   *
   * @param updatedElement - The updated ColorElement
   * @returns A new Template with the updated ColorElement
   */
  function updateColorElement(updatedElement: ColorElement) {
    const updatedTemplate = updateColorElementInTemplate(state.template, updatedElement);
    console.log(updatedTemplate);

    // if (templateEditorContext) {
    //   templateEditorContext.updateTemplate(updatedTemplate);
    // } else {
    //   dispatch({ type: 'SET_TEMPLATE', payload: { ...updatedTemplate } });
    // }
  }

  function updateText(updatedText: Text) {
    const { template } = state;
    const updatedTemplate = updateTextsInTemplate(template, [updatedText]);
    console.log(updatedTemplate);

    // if (templateEditorContext) {
    //   templateEditorContext.updateTemplate(updatedTemplate);
    // } else {
    //   dispatch({ type: 'SET_TEMPLATE', payload: { ...updatedTemplate } });
    // }
  }

  function setCurrentTextId(textId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_TEXT_ID', payload: textId });
  }

  function setCanvas(canvas: Canvas) {
    console.log(canvas);
    // if (templateEditorContext) {
    //   templateEditorContext.setCanvas(canvas);
    // }
    // dispatch({ type: 'SET_CANVAS', payload: canvas });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        dispatch,
        updateTemplate,
        currentLayer,
        updateLayer,
        setCurrentLayerId,
        currentColorElement,
        setCurrentColorElementId,
        updateColorElement,
        currentText,
        setCurrentTextId,
        updateText,
        setCanvas,
      }}
    >
      <div className={className}>{children}</div>
    </ConfiguratorContext.Provider>
  );
}

export const useConfiguratorContext = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfiguratorContext must be used inside ConfiguratorProvider');
  }
  return context;
};
