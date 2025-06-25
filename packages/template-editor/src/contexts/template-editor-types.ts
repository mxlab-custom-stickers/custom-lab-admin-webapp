import type { Color, ColorPalette, Template } from '@clab/types';
import type { Canvas } from 'fabric';

export type TemplateEditorState = {
  template: Template;
  canvas?: Canvas;

  currentLayerId: string | undefined;

  isDirty: boolean;
  isSaving: boolean;

  previewMode: PreviewMode;

  config: {
    colors: Color[];
    colorPalettes: ColorPalette[];
  };
};

export type PreviewMode = 'desktop' | 'mobile' | 'fullscreen';

export type TemplateEditorAction =
  | { type: 'UPDATE_TEMPLATE'; payload: Template }
  | { type: 'SET_CANVAS'; payload: Canvas }
  | { type: 'SET_CURRENT_LAYER_ID'; payload: string | undefined }
  | { type: 'SET_IS_SAVING'; payload: boolean }
  | { type: 'SET_PREVIEW_MODE'; payload: PreviewMode };
