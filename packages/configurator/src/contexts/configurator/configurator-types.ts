import type { CanvasElement, ColorElement, Configuration, TemplateLayer } from '@clab/types';
import type { Canvas } from 'fabric';
import React from 'react';

export type ConfiguratorState = {
  configuration: Configuration;
  history: Configuration[];
  historyIndex: number;
};

export type ConfiguratorContextType = {
  configuration: Configuration;
  performConfigurationUpdate: (
    updater: (prev: Configuration) => Configuration,
    applyVisualChanges?: (canvas: Canvas, config: Configuration) => void
  ) => void;

  canvasRef: React.MutableRefObject<Canvas | null>;
  setCanvas: (canvas: Canvas) => void;

  sidebarView: SidebarView;
  setSidebarView: (view: SidebarView) => void;

  currentLayer: TemplateLayer | undefined;
  setCurrentLayerId: (id: string | undefined) => void;

  selectedElement: SelectedElement | undefined;
  setSelectedElementId: (id: string | undefined) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export type ConfiguratorAction =
  | { type: 'SET_CONFIGURATION'; payload: Configuration }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export type SidebarView = 'home' | 'current-layer' | 'selected-element';

export type SelectedElement =
  | { type: 'color-element'; element: ColorElement }
  | { type: 'canvas-element'; element: CanvasElement };
