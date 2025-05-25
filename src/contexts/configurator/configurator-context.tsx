import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import {
  ConfiguratorAction,
  ConfiguratorState,
} from '@/contexts/configurator/configurator-types.ts';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import {
  findColorElementById,
  updateColorElementInTemplate,
  updateColorItemMap,
} from '@/lib/configurator.ts';
import {
  ColorElement,
  ColorItem,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
import { Canvas, FabricObject } from 'fabric';
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
  setColorItemMap: (colorItemMap: Map<ColorItem, FabricObject[]>) => void;

  // Current layer
  currentLayer: TemplateLayerColor | undefined;
  setCurrentLayerId: (layerId: string | undefined) => void;

  // Current color element
  currentColorElement: ColorElement | undefined;
  setCurrentColorElementId: (currentColorElementId: string | undefined) => void;
  updateColorElement: (updatedElement: ColorElement) => void;
} | null>(null);

type ConfiguratorProviderProps = {
  template: Template;
  currentLayerId?: string;
  children: React.ReactNode;
};

export function ConfiguratorProvider({
  template,
  currentLayerId: currentLayerIdProp,
  children,
}: ConfiguratorProviderProps) {
  const templateEditorContext = useOptionalTemplateEditorContext();

  const [state, dispatch] = useReducer(configuratorReducer, {
    template,
    currentLayerId: undefined,
    currentColorElementId: undefined,
    canvas: undefined,
    colorItemMap: new Map(),
  } as ConfiguratorState);

  const currentLayer = useMemo(
    () => state.template.layers.find((l) => l.id === state.currentLayerId),
    [state.template, state.currentLayerId]
  );

  const currentColorElement = useMemo(
    () =>
      currentLayer && state.currentColorElementId
        ? findColorElementById(
            currentLayer.colorElements,
            state.currentColorElementId
          )
        : undefined,
    [currentLayer, state.currentColorElementId]
  );

  useEffect(() => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, [template]);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayerIdProp });
  }, [currentLayerIdProp]);

  function setCurrentLayerId(layerId: string | undefined) {
    if (templateEditorContext) {
      templateEditorContext.setCurrentLayerId(layerId);
    } else {
      dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
    }
  }

  function setCurrentColorElementId(colorElementId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT_ID', payload: colorElementId });
  }

  /**
   * Update a ColorElement by its id within a Template.
   *
   * @param updates - The updated ColorElement
   * @returns A new Template with the updated ColorElement
   */
  function updateColorElement(updates: ColorElement) {
    const updatedTemplate = updateColorElementInTemplate(
      state.template,
      updates
    );

    if (updates.type === 'item') {
      const updatedColorItemMap = updateColorItemMap(
        state.colorItemMap,
        updates
      );

      updatedColorItemMap.get(updates)?.forEach((obj) => {
        obj.set({
          fill: updates.color.value,
        });
      });
      state.canvas?.requestRenderAll();
      dispatch({ type: 'SET_COLOR_ITEM_MAP', payload: updatedColorItemMap });
    }

    if (templateEditorContext) {
      templateEditorContext.updateTemplate(updatedTemplate);
    } else {
      dispatch({ type: 'SET_TEMPLATE', payload: { ...updatedTemplate } });
    }
  }

  function setCanvas(canvas: Canvas) {
    dispatch({ type: 'SET_CANVAS', payload: canvas });
  }

  function setColorItemMap(colorItemMap: Map<ColorItem, FabricObject[]>) {
    dispatch({ type: 'SET_COLOR_ITEM_MAP', payload: colorItemMap });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        dispatch,
        currentLayer,
        setCurrentLayerId,
        currentColorElement,
        setCurrentColorElementId,
        updateColorElement,
        setCanvas,
        setColorItemMap,
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
