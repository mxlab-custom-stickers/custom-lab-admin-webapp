import type { CanvasObject, ColorElement, Image, Template, TemplateLayer, Text } from '@clab/types';
import { Canvas } from 'fabric';
import React from 'react';

export type ConfiguratorState = {
  template: Template;
  currentLayerId: string | undefined;

  // Overrides the sidebar view with a specific view like the font picker for a text, or the color palette for a color layer
  sidebarView: SidebarView | undefined;

  // The selected color element to show in the sidebar
  selectedColorElementId: string | undefined;
  // The selected text, image... object in the canvas (object that can be selected, moved, resized, etc.)
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

  // Selected color element
  selectedColorElement: ColorElement | undefined;
  setSelectedColorElementId: (selectedColorElementId: string | undefined) => void;
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
  | { type: 'SET_SELECTED_COLOR_ELEMENT_ID'; payload: string | undefined }
  | { type: 'SET_SELECTED_OBJECT_ID'; payload: string | undefined }
  | { type: 'SET_CANVAS'; payload: Canvas };

export type SidebarView =
  | { type: 'color-palette' } // Show the color palette for a color layer
  | { type: 'font-picker' } // Show the font picker for the selected text object
  | { type: 'text-color-picker' }; // Show the text color picker for the selected text object
