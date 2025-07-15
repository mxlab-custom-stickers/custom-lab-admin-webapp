import { configuratorReducer } from '@/contexts/configurator-reducer';
import type {
  ConfiguratorContextType,
  ConfiguratorState,
  SidebarView,
} from '@/contexts/configurator-types.ts';
import {
  type ColorElement,
  type Image,
  isImage,
  isTemplateLayerColor,
  isText,
  type Template,
  type TemplateLayer,
  type Text,
} from '@clab/types';
import type { CanvasObject } from '@clab/types/dist/canvas.ts';
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
  onCanvasInitialized?: (canvas: Canvas) => void;
  onTemplateChange?: (template: Template) => void;
  onCurrentLayerIdChange?: (layerId: string | undefined) => void;
  children: React.ReactNode;
};

export function ConfiguratorProvider({
  className,
  template,
  currentLayerId: currentLayerIdProp,
  onCanvasInitialized,
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
    selectedColorElementId: undefined,
    selectedObjectId: undefined,
    canvas: undefined,
    sidebarView: undefined,
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

  const selectedColorElement: ColorElement | undefined = useMemo(() => {
    if (!currentLayer || !isTemplateLayerColor(currentLayer) || !state.selectedColorElementId)
      return undefined;

    console.log('Finding color element by ID:', state.selectedColorElementId);
    return findColorElementById(currentLayer.colorElements, state.selectedColorElementId);
  }, [currentLayer, state.selectedColorElementId]);

  const selectedObject: CanvasObject | undefined = useMemo(() => {
    if (!state.selectedObjectId || !currentLayer) return undefined;

    switch (currentLayer.type) {
      case 'image':
        return currentLayer.images.find((img) => img.id === state.selectedObjectId);
      case 'text':
        return currentLayer.texts.find((text) => text.id === state.selectedObjectId);
      case 'color':
        return undefined;
      default:
        return undefined;
    }
  }, [currentLayer, state.selectedObjectId]);

  function updateTemplate(updatedTemplate: Template) {
    dispatch({ type: 'SET_TEMPLATE', payload: updatedTemplate });
    if (isTemplateControlled) onTemplateChange?.(updatedTemplate);
  }

  function setCanvas(canvas: Canvas) {
    dispatch({ type: 'SET_CANVAS', payload: canvas });
    onCanvasInitialized?.(canvas);
  }

  function setCurrentLayerId(layerId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
    dispatch({ type: 'SET_SIDEBAR_VIEW', payload: undefined });
    dispatch({ type: 'SET_SELECTED_COLOR_ELEMENT_ID', payload: undefined });
    dispatch({ type: 'SET_SELECTED_OBJECT_ID', payload: undefined });
    if (isLayerControlled) onCurrentLayerIdChange?.(layerId);
  }

  function updateLayer(updatedLayer: TemplateLayer) {
    const updatedTemplate = {
      ...state.template,
      layers: state.template.layers.map((l) =>
        l.id === updatedLayer.id ? { ...l, ...updatedLayer } : l
      ),
    };
    updateTemplate(updatedTemplate);
  }

  function setSidebarView(view: SidebarView | undefined) {
    dispatch({ type: 'SET_SIDEBAR_VIEW', payload: view });
  }

  function setSelectedColorElementId(colorElementId: string | undefined) {
    dispatch({ type: 'SET_SELECTED_COLOR_ELEMENT_ID', payload: colorElementId });
  }

  function updateColorElement(updatedElement: ColorElement) {
    const updatedTemplate = updateColorElementInTemplate(state.template, updatedElement);
    updateTemplate(updatedTemplate);
  }

  function setSelectedObjectId(id: string | undefined) {
    dispatch({ type: 'SET_SELECTED_OBJECT_ID', payload: id });
    dispatch({ type: 'SET_SIDEBAR_VIEW', payload: undefined });
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
    if (!state.selectedObjectId || !selectedObject) return;

    let updatedTemplate: Template | undefined = undefined;
    if (isImage(selectedObject)) {
      updatedTemplate = deleteImageInTemplate(state.template, state.selectedObjectId);
    } else if (isText(selectedObject)) {
      updatedTemplate = deleteTextInTemplate(state.template, state.selectedObjectId);
    }

    if (updatedTemplate) {
      updateTemplate(updatedTemplate);
    }
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
        setSidebarView,
        selectedColorElement,
        setSelectedColorElementId,
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
