import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import {
  ConfiguratorAction,
  ConfiguratorState,
  CurrentColorElement,
} from '@/contexts/configurator/configurator-types.ts';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import {
  findColorElementById,
  updateColorElementInTemplate,
  updateTextsInTemplate,
} from '@/lib/configurator.ts';
import { ColorElement, Template, TemplateLayer } from '@/models/template.ts';
import { Text } from '@/models/text';
import { Canvas } from 'fabric';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

export const ConfiguratorContext = createContext<{
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;

  // FabricJS
  setCanvas: (canvas: Canvas) => void;

  updateTemplate: (template: Template) => void;

  // Current layer
  currentLayer: TemplateLayer | undefined;
  setCurrentLayerId: (layerId: string | undefined) => void;
  updateLayer: (layer: TemplateLayer) => void;

  // Current color element
  currentColorElement: CurrentColorElement | undefined;
  setCurrentColorElementId: (currentColorElementId: string | undefined) => void;
  updateColorElement: (updatedElement: ColorElement) => void;

  currentText: Text | undefined;
  setCurrentTextId: (textId: string | undefined) => void;
  updateText: (updatedText: Text) => void;
} | null>(null);

type ConfiguratorProviderProps = {
  template: Template;
  currentLayerId?: string;
  children: React.ReactNode;
};

export function Configurator({
  template,
  currentLayerId: currentLayerIdProp,
  children,
}: ConfiguratorProviderProps) {
  const templateEditorContext = useOptionalTemplateEditorContext();

  const [state, dispatch] = useReducer(configuratorReducer, {
    template,
    currentLayerId: undefined,
    currentColorElementId: undefined,
    currentTextId: undefined,
    canvas: undefined,
  } as ConfiguratorState);

  const currentLayer = useMemo(
    () => state.template.layers.find((l) => l.id === state.currentLayerId),
    [state.template, state.currentLayerId]
  );

  const currentColorElement: CurrentColorElement = useMemo(() => {
    if (
      !currentLayer ||
      currentLayer.type !== 'color' ||
      !state.currentColorElementId
    )
      return undefined;

    if (state.currentColorElementId === 'color-palette') {
      return {
        id: 'color-palette',
        type: 'color-palette',
        parentId: undefined,
      };
    }

    return findColorElementById(
      currentLayer.colorElements,
      state.currentColorElementId
    );
  }, [currentLayer, state.currentColorElementId]);

  const currentText: Text | undefined = useMemo(() => {
    if (!currentLayer || currentLayer.type !== 'text') return undefined;
    return currentLayer.texts.find((t) => t.id === state.currentTextId);
  }, [currentLayer, state.currentTextId]);

  useEffect(() => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, [template]);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayerIdProp });
  }, [currentLayerIdProp]);

  function updateTemplate(template: Template) {
    if (templateEditorContext) {
      templateEditorContext.updateTemplate(template);
    } else {
      dispatch({ type: 'SET_TEMPLATE', payload: template });
    }
  }

  function setCurrentLayerId(layerId: string | undefined) {
    if (templateEditorContext) {
      templateEditorContext.setCurrentLayerId(layerId);
    } else {
      dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
    }
    dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT_ID', payload: undefined });
  }

  function updateLayer(layer: TemplateLayer) {
    const updatedTemplate = {
      ...state.template,
      layers: state.template.layers.map((l) =>
        l.id === layer.id ? { ...l, ...layer } : l
      ),
    };

    if (templateEditorContext) {
      templateEditorContext.updateTemplate(updatedTemplate);
    } else {
      dispatch({ type: 'SET_TEMPLATE', payload: updatedTemplate });
    }
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
    const updatedTemplate = updateColorElementInTemplate(
      state.template,
      updatedElement
    );

    if (templateEditorContext) {
      templateEditorContext.updateTemplate(updatedTemplate);
    } else {
      dispatch({ type: 'SET_TEMPLATE', payload: { ...updatedTemplate } });
    }
  }

  function updateText(updatedText: Text) {
    const { template } = state;
    const updatedTemplate = updateTextsInTemplate(template, [updatedText]);

    if (templateEditorContext) {
      templateEditorContext.updateTemplate(updatedTemplate);
    } else {
      dispatch({ type: 'SET_TEMPLATE', payload: { ...updatedTemplate } });
    }
  }

  function setCurrentTextId(textId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_TEXT_ID', payload: textId });
  }

  function setCanvas(canvas: Canvas) {
    if (templateEditorContext) {
      templateEditorContext.setCanvas(canvas);
    }
    dispatch({ type: 'SET_CANVAS', payload: canvas });
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
