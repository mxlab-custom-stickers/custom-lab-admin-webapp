import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import {
  ConfiguratorAction,
  ConfiguratorState,
  CurrentColorElement,
} from '@/contexts/configurator/configurator-types.ts';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import {
  findColorElementById,
  getAllColorItemsFromLayer,
  updateColorElementInTemplate,
} from '@/lib/configurator.ts';
import {
  ColorElement,
  Template,
  TemplateLayerColor,
} from '@/models/template.ts';
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
  currentLayer: TemplateLayerColor | undefined;
  setCurrentLayerId: (layerId: string | undefined) => void;
  updateLayer: (layer: TemplateLayerColor) => void;

  // Current color element
  currentColorElement: CurrentColorElement | undefined;
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

  const currentColorElement: CurrentColorElement = useMemo(() => {
    if (!currentLayer || !state.currentColorElementId) return undefined;

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

  useEffect(() => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, [template]);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayerIdProp });
  }, [currentLayerIdProp]);

  function updateTemplate(template: Template) {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }

  function setCurrentLayerId(layerId: string | undefined) {
    if (templateEditorContext) {
      templateEditorContext.setCurrentLayerId(layerId);
    } else {
      dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
    }
  }

  function updateLayer(layer: TemplateLayerColor) {
    const updatedTemplate = {
      ...state.template,
      layers: state.template.layers.map((l) =>
        l.id === layer.id ? { ...l, ...layer } : l
      ),
    };

    if (layer.type === 'color') {
      // Retrieve all color items from the layer that have a different fill color
      const updatedColorItems = getAllColorItemsFromLayer(layer).filter(
        (colorItem) =>
          colorItem.color.value !== colorItem.fabricObjects?.[0]?.get('fill')
      );

      updatedColorItems.forEach((colorItem) => {
        colorItem.fabricObjects?.forEach((obj) => {
          obj.set('fill', colorItem.color.value);
        });
      });
      state.canvas?.requestRenderAll();
    }

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
   * @param updates - The updated ColorElement
   * @returns A new Template with the updated ColorElement
   */
  function updateColorElement(updates: ColorElement) {
    const updatedTemplate = updateColorElementInTemplate(
      state.template,
      updates
    );

    if (
      updates.type === 'item' &&
      updates.color.value !== updates.fabricObjects?.[0]?.get('fill')
    ) {
      updates.fabricObjects?.forEach((obj) => {
        obj.set('fill', updates.color.value);
        state.canvas?.requestRenderAll();
      });
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
