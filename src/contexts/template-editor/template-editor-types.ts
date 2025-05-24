import { Color, ColorPalette } from '@/models/color.ts';
import { Template, TemplateLayerColor } from '@/models/template.ts';

export type TemplateEditorState = {
  template: Template;

  currentLayer: TemplateLayerColor | undefined;

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
  | { type: 'SET_IS_SAVING'; payload: boolean }
  | { type: 'SET_PREVIEW_MODE'; payload: PreviewMode };
