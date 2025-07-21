import type {
  CanvasElement,
  ColorElement,
  Image,
  Template,
  TemplateLayer,
  Text,
} from '@clab/types';
import { Canvas } from 'fabric';
import React from 'react';

export type ConfiguratorState = {
  template: Template;
  currentLayerId: string | undefined;

  sidebarView: SidebarViewType | undefined;
  selectedElementId: ColorElement | CanvasElement | undefined;

  canvas?: Canvas;
};

export type ConfiguratorContextType = {
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;

  // FabricJS
  setCanvas: (canvas: Canvas) => void;

  updateTemplate: (template: Template) => void;

  // Current layer
  currentLayer: TemplateLayer | undefined;
  setCurrentLayerId: (layerId: string | undefined) => void;
  updateLayer: (layer: TemplateLayer) => void;

  // UI
  setSidebarView: (view: SidebarViewType | undefined) => void;

  // Selected color element
  selectedColorElement: ColorElement | undefined;
  setSelectedColorElementId: (selectedColorElementId: string | undefined) => void;
  updateColorElement: (updatedElement: ColorElement) => void;

  // Selected object
  selectedObject: CanvasElement | undefined;
  setSelectedObjectId: (id: string | undefined) => void;
  deleteSelectedObject: () => void;

  updateText: (updatedText: Text) => void;
  updateImage: (updatedImage: Image) => void;
};

export type ConfiguratorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_CURRENT_LAYER_ID'; payload: string | undefined }
  | { type: 'SET_SIDEBAR_VIEW'; payload: SidebarViewType | undefined }
  | { type: 'SET_SELECTED_COLOR_ELEMENT_ID'; payload: string | undefined }
  | { type: 'SET_SELECTED_OBJECT_ID'; payload: string | undefined }
  | { type: 'SET_CANVAS'; payload: Canvas };

export type SidebarViewType =
  | 'layer-color'
  | 'layer-image'
  | 'layer-text'
  | 'color-element'
  | 'color-palette'
  | 'font-picker'
  | 'text-colors';
