import { SvgLayer } from '@/models/svg-editor.ts';
import React, { createContext, useContext } from 'react';

type SvgEditorContextType = {
  isInjecting: boolean;
  setIsInjecting: React.Dispatch<React.SetStateAction<boolean>>;

  svgLayers: SvgLayer[];
  setSvgLayers: React.Dispatch<React.SetStateAction<SvgLayer[]>>;

  initialSelectedLayerIds?: string[];
  selectedLayers: SvgLayer[];
  setSelectedLayers: (layers: SvgLayer[]) => void;
};

export const SvgEditorContext = createContext<SvgEditorContextType>({} as SvgEditorContextType);

export const useSvgEditorContext = () => useContext(SvgEditorContext);
