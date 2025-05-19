import { Color, ColorPalette } from '@/models/color.ts';
import { createContext, useContext } from 'react';

type TemplateEditorContextType = {
  allColors: Color[];
  allColorPalettes: ColorPalette[];

  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;

  showSvgLayerPicker: boolean;
  setShowSvgLayerPicker: (show: boolean) => void;
};

export type PreviewMode = 'desktop' | 'mobile' | 'fullscreen';

export const TemplateEditorContext = createContext<TemplateEditorContextType>(
  {} as TemplateEditorContextType
);

export const useTemplateEditorContext = () => useContext(TemplateEditorContext);
