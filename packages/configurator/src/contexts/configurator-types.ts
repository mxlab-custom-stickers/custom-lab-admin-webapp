import type { ColorElement, Image, Template, TemplateLayer, Text } from '@clab/types';
import type { CanvasObject } from '@clab/types/dist/canvas.ts';
import { Canvas } from 'fabric';
import React from 'react';

export type ConfiguratorState = {
  template: Template;
  currentLayerId: string | undefined;

  sidebarView: SidebarView | undefined;

  currentColorElementId: string | undefined;
  selectedObjectId: string | undefined;

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
  setSidebarView: (view: SidebarView | undefined) => void;

  // Current color element
  currentColorElement: CurrentColorElement | undefined;
  setCurrentColorElementId: (currentColorElementId: string | undefined) => void;
  updateColorElement: (updatedElement: ColorElement) => void;

  // Selected object
  selectedObject: CanvasObject | undefined;
  setSelectedObjectId: (id: string | undefined) => void;
  deleteSelectedObject: () => void;

  updateText: (updatedText: Text) => void;
  updateImage: (updatedImage: Image) => void;
};

export type ConfiguratorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_CURRENT_LAYER_ID'; payload: string | undefined }
  | { type: 'SET_SIDEBAR_VIEW'; payload: SidebarView | undefined }
  | { type: 'SET_CURRENT_COLOR_ELEMENT_ID'; payload: string | undefined }
  | { type: 'SET_SELECTED_OBJECT_ID'; payload: string | undefined }
  | { type: 'SET_CANVAS'; payload: Canvas };

export type CurrentColorElement =
  | ColorElement
  | { id: 'color-palette'; type: 'color-palette'; parentId: undefined }
  | undefined;

export type CurrentColorElementType = ColorElement['type'] | 'color-palette';

export type SidebarView =
  | { type: 'color-element'; colorElement: ColorElement }
  | { type: 'color-palette' }
  | { type: 'font-picker' }
  | { type: 'text-color-picker' };
