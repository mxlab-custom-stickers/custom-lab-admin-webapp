import {
  TemplateEditorAction,
  TemplateEditorState,
} from '@/contexts/template-editor/template-editor-types.ts';

export function templateEditorReducer(
  state: TemplateEditorState,
  action: TemplateEditorAction
): TemplateEditorState {
  switch (action.type) {
    case 'SET_IS_SAVING': {
      return { ...state, isSaving: action.payload };
    }
    case 'UPDATE_TEMPLATE': {
      return { ...state, template: action.payload };
    }
    default: {
      return state;
    }
  }
}
