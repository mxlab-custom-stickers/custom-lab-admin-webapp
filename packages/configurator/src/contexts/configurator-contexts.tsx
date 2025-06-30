import { configuratorReducer } from '@/contexts/configurator-reducer';
import type {
  ConfiguratorContextType,
  ConfiguratorState,
  CurrentColorElement,
  SelectedObject,
} from '@/contexts/configurator-types.ts';
import type { ColorElement, Image, Template, TemplateLayer, Text } from '@clab/types';
import {
  cn,
  deleteImageInTemplate,
  deleteTextInTemplate,
  findColorElementById,
  updateColorElementInTemplate,
  updateImagesInTemplate,
  updateTextsInTemplate,
} from '@clab/utils';
import type { Canvas } from 'fabric';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

export const ConfiguratorContext = createContext<ConfiguratorContextType | null>(null);

type ConfiguratorProviderProps = {
  className?: string;
  template: Template;
  currentLayerId?: string;
  onTemplateChange?: (template: Template) => void;
  onCurrentLayerIdChange?: (layerId: string | undefined) => void;
  children: React.ReactNode;
};

export function ConfiguratorProvider({
  className,
  template,
  currentLayerId: currentLayerIdProp,
  onTemplateChange,
  onCurrentLayerIdChange,
  children,
}: ConfiguratorProviderProps) {
  const isTemplateControlled = !!onTemplateChange;
  const isLayerControlled = currentLayerIdProp !== undefined && !!onCurrentLayerIdChange;

  const initialLayerId = currentLayerIdProp ?? template.layers[0]?.id;

  const [state, dispatch] = useReducer(configuratorReducer, {
    template,
    currentLayerId: initialLayerId,
    currentColorElementId: undefined,
    selectedObjectId: undefined,
    canvas: undefined,
  } satisfies ConfiguratorState);

  const previousTemplateRef = useRef<Template | null>(null);
  const previousLayerIdRef = useRef<string | undefined>(undefined);

  // Sync reducer state when controlled props change
  useEffect(() => {
    if (isTemplateControlled && template !== previousTemplateRef.current) {
      dispatch({ type: 'SET_TEMPLATE', payload: template });
      previousTemplateRef.current = template;
    }
  }, [template]);

  useEffect(() => {
    if (isLayerControlled && currentLayerIdProp !== previousLayerIdRef.current) {
      dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: currentLayerIdProp });
      previousLayerIdRef.current = currentLayerIdProp;
    }
  }, [currentLayerIdProp]);

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

  const selectedObject: SelectedObject | undefined = useMemo(() => {
    if (!state.selectedObjectId) return undefined;
    if (!currentLayer) return undefined;

    if (currentLayer.type === 'image') {
      const image = currentLayer.images.find((img) => img.id === state.selectedObjectId);
      return image ? { type: 'image', image } : undefined;
    } else if (currentLayer.type === 'text') {
      const text = currentLayer.texts.find((txt) => txt.id === state.selectedObjectId);
      return text ? { type: 'text', text } : undefined;
    }
    return undefined;
  }, [currentLayer, state.selectedObjectId]);

  function updateTemplate(updatedTemplate: Template) {
    dispatch({ type: 'SET_TEMPLATE', payload: updatedTemplate });
    if (isTemplateControlled) onTemplateChange?.(updatedTemplate);
  }

  function setCurrentLayerId(layerId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
    dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT_ID', payload: undefined });
    if (isLayerControlled) onCurrentLayerIdChange?.(layerId);
  }

  function updateLayer(layer: TemplateLayer) {
    const updatedTemplate = {
      ...state.template,
      layers: state.template.layers.map((l) => (l.id === layer.id ? { ...l, ...layer } : l)),
    };
    updateTemplate(updatedTemplate);
  }

  function setCurrentColorElementId(colorElementId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_COLOR_ELEMENT_ID', payload: colorElementId });
  }

  function updateColorElement(updatedElement: ColorElement) {
    const updatedTemplate = updateColorElementInTemplate(state.template, updatedElement);
    updateTemplate(updatedTemplate);
  }

  function setSelectedObjectId(id: string | undefined) {
    dispatch({ type: 'SET_SELECTED_OBJECT_ID', payload: id });
  }

  function updateText(updatedText: Text) {
    const updatedTemplate = updateTextsInTemplate(state.template, [updatedText]);
    updateTemplate(updatedTemplate);
  }

  function updateImage(updatedImage: Image) {
    const updatedTemplate = updateImagesInTemplate(state.template, [updatedImage]);
    updateTemplate(updatedTemplate);
  }

  function deleteSelectedObject() {
    if (!selectedObject) return;

    let updatedTemplate: Template | undefined = undefined;
    if (selectedObject.type === 'image') {
      updatedTemplate = deleteImageInTemplate(state.template, selectedObject.image.id);
    } else if (selectedObject.type === 'text') {
      updatedTemplate = deleteTextInTemplate(state.template, selectedObject.text.id);
    }

    if (updatedTemplate) {
      updateTemplate(updatedTemplate);
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
        selectedObject,
        setSelectedObjectId,
        deleteSelectedObject,
        updateText,
        updateImage,
        setCanvas,
      }}
    >
      <div className={cn('clab-configurator', className)}>{children}</div>
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
