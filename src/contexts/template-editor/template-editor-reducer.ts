import {
  TemplateEditorAction,
  TemplateEditorState,
} from '@/contexts/template-editor/template-editor-types.ts';

export function templateEditorReducer(
  state: TemplateEditorState,
  action: TemplateEditorAction
): TemplateEditorState {
  switch (action.type) {
    case 'UPDATE_TEMPLATE': {
      return { ...state, template: action.payload };
    }
    case 'SET_CURRENT_LAYER_ID': {
      return { ...state, currentLayerId: action.payload };
    }
    case 'SET_IS_SAVING': {
      return { ...state, isSaving: action.payload };
    }
    case 'SET_PREVIEW_MODE': {
      return { ...state, previewMode: action.payload };
    }
    default: {
      return state;
    }
  }
}
