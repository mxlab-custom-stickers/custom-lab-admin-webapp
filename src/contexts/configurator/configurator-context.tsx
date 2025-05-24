import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import {
  ConfiguratorAction,
  ConfiguratorState,
} from '@/contexts/configurator/configurator-types.ts';
import { useOptionalTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import {
  findColorElementById,
  updateColorElementById,
} from '@/lib/configurator.ts';
import { ColorElement, Template } from '@/models/template.ts';
import { Canvas, FabricObject } from 'fabric';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

export const ConfiguratorContext = createContext<{
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;

  // FabricJS
  setCanvas: React.Dispatch<React.SetStateAction<Canvas | undefined>>;
  setCurrentFabricObjects: React.Dispatch<React.SetStateAction<FabricObject[]>>;

  // Current layer
  setCurrentLayer: (layerId: string | undefined) => void;
  // Current color element
  setCurrentColorElement: (
    currentColorElement: ColorElement | undefined
  ) => void;
  updateColorElement: (updates: ColorElement) => void;
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
    currentLayer: undefined,
    currentColorElement: undefined,
  } as ConfiguratorState);

  // Current layer management
  const [currentLayerId, setCurrentLayerId] = useState(currentLayerIdProp);
  const currentLayer = useMemo(
    () => state.template.layers.find((l) => l.id === currentLayerId),
    [state.template.layers, currentLayerId]
  );
  useEffect(() => {
    setCurrentLayerId(currentLayerIdProp);
  }, [currentLayerIdProp]);

  // FabricJS canvas and objects management
  const [canvas, setCanvas] = useState<Canvas>();
  const [currentFabricObjects, setCurrentFabricObjects] = useState<
    FabricObject[]
  >([]);

  useEffect(() => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, [template]);

  function setCurrentLayer(layerId: string | undefined) {
    if (templateEditorContext) {
      templateEditorContext.setCurrentLayer(layerId);
    } else {
      setCurrentLayerId(layerId);
    }
  }

  function setCurrentColorElement(
    currentColorElement: ColorElement | undefined
  ) {
    dispatch({
      type: 'SET_CURRENT_COLOR_ELEMENT',
      payload: currentColorElement,
    });
  }

  function updateColorElement(updates: ColorElement) {
    const { template } = state;

    if (!currentLayer || currentLayer.type !== 'color') return;

    const colorElementToUpdate = findColorElementById(
      currentLayer.colorElements,
      updates.id
    );
    if (!colorElementToUpdate) throw new Error('Color element not found');

    const isSameColor =
      colorElementToUpdate.type === 'item' &&
      updates.type === 'item' &&
      updates.color.value === colorElementToUpdate.color.value;

    if (!isSameColor) {
      // Update fill color on canvas objects
      if (colorElementToUpdate.type === 'item' && updates.type === 'item') {
        currentFabricObjects
          .filter((obj) => obj.get('id') === updates.id)
          .forEach((obj) => obj.set('fill', updates.color.value));
        canvas?.requestRenderAll();
      }
    }

    // Update nested color element
    const updatedColorElements = updateColorElementById(
      currentLayer.colorElements,
      updates.id,
      () => ({ ...colorElementToUpdate, ...updates })
    );

    // Build updated layer and template
    const updatedLayer = {
      ...currentLayer,
      colorElements: updatedColorElements,
    };
    const updatedTemplate = {
      ...template,
      layers: template.layers.map((layer) =>
        layer.id === currentLayerId ? updatedLayer : layer
      ),
    };

    if (templateEditorContext) {
      templateEditorContext.updateCurrentLayer({ ...updatedLayer });
    } else {
      dispatch({ type: 'SET_TEMPLATE', payload: updatedTemplate });
    }

    dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT', payload: updates });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state: { ...state, currentLayer },
        dispatch,
        setCurrentLayer,
        setCurrentColorElement,
        updateColorElement,
        setCanvas,
        setCurrentFabricObjects,
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
