import { templateEditorReducer } from '@/contexts/template-editor/template-editor-reducer.ts';
import {
  PreviewMode,
  TemplateEditorAction,
  TemplateEditorState,
} from '@/contexts/template-editor/template-editor-types.ts';
import * as firestore from '@/lib/firebase/firestore.ts';
import { Template } from '@/models/template.ts';
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
  setPreviewMode: (previewMode: PreviewMode) => void;
  updateTemplate: (updates: Template) => void;
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
    currentLayerId: undefined,
    isDirty: false,
    isSaving: false,
    previewMode: 'desktop',
    showSvgLayerPicker: false,
  });

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

  function setPreviewMode(previewMode: PreviewMode) {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: previewMode });
  }

  function updateTemplate(updates: Template) {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: updates });
  }

  return (
    <TemplateEditorContext.Provider
      value={{
        state: { ...state, isDirty },
        dispatch,
        setPreviewMode,
        updateTemplate,
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
