import { Color, ColorPalette } from '@/models/color.ts';
import { EditTemplate } from '@/models/template.ts';
import { createContext, useContext } from 'react';

type TemplateEditorContextType = {
  template: EditTemplate;
  setTemplate: (template: EditTemplate) => void;
  svgInjecting?: boolean;

  allColors?: Color[];
  allColorPalettes?: ColorPalette[];
};

export const TemplateEditorContext = createContext<TemplateEditorContextType>(
  {} as TemplateEditorContextType
);

export const useTemplateEditorContext = () => useContext(TemplateEditorContext);
