import type { CanvasElement, ColorElement, Configuration, TemplateLayer } from '@clab/types';
import type { Canvas } from 'fabric';

export type ConfiguratorState = {
  configuration: Configuration;
  history: Configuration[];
  historyIndex: number;
};

export type ConfiguratorContextType = {
  configuration: Configuration;
  setConfiguration: (config: Configuration) => void;
  performConfigurationUpdate: (
    updater: (prev: Configuration, currentLayer: TemplateLayer) => Configuration,
    applyVisualChanges?: (canvas: Canvas, config: Configuration) => void
  ) => void;

  setCanvas: (canvas: Canvas) => void;
  canvasCenterPos: { x: number; y: number };

  sidebarView: SidebarView;
  setSidebarView: (view: SidebarView) => void;

  currentLayer: TemplateLayer | undefined;
  setCurrentLayerId: (id: string | undefined) => void;

  selectedElement: SelectedElement | undefined;
  setSelectedElementId: (id: string | undefined) => void;

  undo: (applyVisualChanges?: (canvas: Canvas, config: Configuration) => void) => void;
  redo: (applyVisualChanges?: (canvas: Canvas, config: Configuration) => void) => void;
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
