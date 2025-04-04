import { Color, ColorPalette } from '@/models/color.ts';
import { createContext, useContext } from 'react';

type TemplateEditorContextType = {
  allColors: Color[];
  allColorPalettes: ColorPalette[];
};

export const TemplateEditorContext = createContext<TemplateEditorContextType>(
  {} as TemplateEditorContextType
);

export const useTemplateEditorContext = () => useContext(TemplateEditorContext);
