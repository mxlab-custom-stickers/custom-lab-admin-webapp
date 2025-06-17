import { templateEditorReducer } from '@/contexts/template-editor/template-editor-reducer.ts';
import {
  PreviewMode,
  TemplateEditorAction,
  TemplateEditorState,
} from '@/contexts/template-editor/template-editor-types.ts';
import { COLOR_PALETTES_FIXTURE } from '@/fixtures/color-palettes.fixture.ts';
import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import * as firestore from '@/lib/firebase/firestore.ts';
import { stripFabricObjectsFromTemplate } from '@/lib/template-editor.ts';
import { Template, TemplateLayer } from '@/models/template.ts';
import { Canvas } from 'fabric';
import { isEqual } from 'lodash';
import React, { createContext, useContext, useMemo, useReducer, useState } from 'react';

const TemplateEditorContext = createContext<{
  state: TemplateEditorState;
  dispatch: React.Dispatch<TemplateEditorAction>;

  updateTemplate: (updates: Template) => void;
  setCanvas: (canvas: Canvas) => void;

  currentLayer: TemplateLayer | undefined;
  setCurrentLayerId: (layerId: string | undefined) => void;
  updateLayer: (updates: TemplateLayer) => void;

  setPreviewMode: (previewMode: PreviewMode) => void;
  saveTemplateState: () => void;
} | null>(null);

export function TemplateEditorProvider({
  template: templateProp,
  children,
}: {
  template: Template;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(templateEditorReducer, {
    template: templateProp,
    canvas: undefined,
    currentLayerId: templateProp.layers[0]?.id,
    isDirty: false,
    isSaving: false,
    previewMode: 'desktop',
    config: {
      colors: COLORS_FIXTURE,
      colorPalettes: COLOR_PALETTES_FIXTURE,
    },
  });

  const [lastSavedTemplateState, setLastSavedTemplateState] = useState<Template>(templateProp);
  const isDirty = useMemo(
    () =>
      !isEqual(
        stripFabricObjectsFromTemplate(state.template),
        stripFabricObjectsFromTemplate(lastSavedTemplateState)
      ),
    [state, lastSavedTemplateState]
  );

  const currentLayer = useMemo(
    () => state.template.layers.find((l) => l.id === state.currentLayerId),
    [state.template.layers, state.currentLayerId]
  );

  async function saveTemplateState() {
    if (!isDirty) return;
    dispatch({ type: 'SET_IS_SAVING', payload: true });
    await firestore.updateTemplate(stripFabricObjectsFromTemplate(state.template));
    dispatch({ type: 'SET_IS_SAVING', payload: false });
    setLastSavedTemplateState(state.template);
  }

  function setCurrentLayerId(layerId: string | undefined) {
    dispatch({ type: 'SET_CURRENT_LAYER_ID', payload: layerId });
  }

  function setPreviewMode(previewMode: PreviewMode) {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: previewMode });
  }

  function updateTemplate(updates: Template) {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: updates });
  }

  function setCanvas(canvas: Canvas) {
    dispatch({ type: 'SET_CANVAS', payload: canvas });
  }

  function updateLayer(updates: TemplateLayer) {
    const updatedTemplate = {
      ...state.template,
      layers: state.template.layers.map((layer) => (layer.id === updates.id ? updates : layer)),
    };

    dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });
  }

  return (
    <TemplateEditorContext.Provider
      value={{
        state: { ...state, isDirty },
        dispatch,
        currentLayer,
        setCurrentLayerId,
        setPreviewMode,
        setCanvas,
        updateTemplate,
        updateLayer,
        saveTemplateState,
      }}
    >
      {children}
    </TemplateEditorContext.Provider>
  );
}

export const useTemplateEditorContext = () => {
  const context = useContext(TemplateEditorContext);
  if (!context) {
    throw new Error('useTemplateEditorContext must be used inside TemplateEditorProvider');
  }
  return context;
};

export const useOptionalTemplateEditorContext = () => useContext(TemplateEditorContext);
