import { templateEditorReducer } from '@/contexts/template-editor/template-editor-reducer.ts';
import {
  PreviewMode,
  TemplateEditorAction,
  TemplateEditorState,
} from '@/contexts/template-editor/template-editor-types.ts';
import { COLOR_PALETTES_FIXTURE } from '@/fixtures/color-palettes.fixture.ts';
import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import * as firestore from '@/lib/firebase/firestore.ts';
import { Template, TemplateLayerColor } from '@/models/template.ts';
import { isEqual } from 'lodash';
import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';

const TemplateEditorContext = createContext<{
  state: TemplateEditorState;
  dispatch: React.Dispatch<TemplateEditorAction>;
  setCurrentLayer: (layerId: string | undefined) => void;
  setPreviewMode: (previewMode: PreviewMode) => void;
  updateTemplate: (updates: Template) => void;
  updateCurrentLayer: (updates: TemplateLayerColor) => void;
  saveTemplateState: () => void;
} | null>(null);

export function TemplateEditorProvider({
  template,
  children,
}: {
  template: Template;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(templateEditorReducer, {
    template,
    currentLayer: undefined,
    isDirty: false,
    isSaving: false,
    previewMode: 'desktop',
    config: {
      colors: COLORS_FIXTURE,
      colorPalettes: COLOR_PALETTES_FIXTURE,
    },
  });

  const [currentLayerId, setCurrentLayerId] = useState<string>();
  const currentLayer = useMemo(
    () => state.template.layers.find((l) => l.id === currentLayerId),
    [state.template.layers, currentLayerId]
  );

  const [lastSavedTemplateState, setLastSavedTemplateState] =
    useState<Template>(template);
  const isDirty = useMemo(
    () => !isEqual(state.template, lastSavedTemplateState),
    [state, lastSavedTemplateState]
  );

  async function saveTemplateState() {
    if (!isDirty) return;
    dispatch({ type: 'SET_IS_SAVING', payload: true });
    await firestore.updateTemplate(state.template);
    dispatch({ type: 'SET_IS_SAVING', payload: false });
    setLastSavedTemplateState(state.template);
  }

  function setCurrentLayer(layerId: string | undefined) {
    setCurrentLayerId(layerId);
  }

  function setPreviewMode(previewMode: PreviewMode) {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: previewMode });
  }

  function updateTemplate(updates: Template) {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: updates });
  }

  function updateCurrentLayer(updates: TemplateLayerColor) {
    if (!currentLayer) return;

    const updatedLayer = { ...currentLayer, ...updates };
    const updatedTemplate = {
      ...state.template,
      layers: state.template.layers.map((layer) =>
        layer.id === currentLayer.id ? updatedLayer : layer
      ),
    };

    dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });
  }

  return (
    <TemplateEditorContext.Provider
      value={{
        state: { ...state, currentLayer, isDirty },
        dispatch,
        setCurrentLayer,
        setPreviewMode,
        updateTemplate,
        updateCurrentLayer,
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
    throw new Error(
      'useTemplateEditorContext must be used inside TemplateEditorProvider'
    );
  }
  return context;
};

export const useOptionalTemplateEditorContext = () =>
  useContext(TemplateEditorContext);
