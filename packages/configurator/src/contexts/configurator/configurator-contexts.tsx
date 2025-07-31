import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import type {
  ConfiguratorContextType,
  ConfiguratorState,
  SelectedElement,
  SidebarView,
} from '@/contexts/configurator/configurator-types.ts';
import {
  activateFabricObjectsInLayerColor,
  activateFabricObjectsInLayerImage,
  deactivateFabricObjectsInConfigurationByLayerIds,
} from '@/utils/canvas';
import { updateImage } from '@/utils/layer-image-helpers.ts';
import { type Configuration, type TemplateLayer } from '@clab/types';
import { cn, findColorElementById } from '@clab/utils';
import type { Canvas } from 'fabric';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

const ConfiguratorContext = createContext<ConfiguratorContextType | null>(null);

type ConfiguratorProviderProps = {
  className?: string; // optional className for the provider div

  initialConfiguration: Configuration;
  configuration?: Configuration; // controlled config (optional)
  onConfigurationChange?: (config: Configuration) => void; // controlled config setter

  currentLayerId?: string | undefined; // controlled
  onCurrentLayerIdChange?: (id: string | undefined) => void; // controlled setter

  children: React.ReactNode;
};

const STORAGE_KEY = 'configurator_state';
export const MAX_HISTORY_LENGTH = 100; // Limit history length to prevent memory issues

/**
 * Enhances the reducer to persist the configuration state to localStorage
 * @param reducer
 */
function withPersistence(reducer: typeof configuratorReducer): typeof configuratorReducer {
  return (state, action) => {
    const newState = reducer(state, action);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error('Failed to persist configurator state:', err);
    }
    return newState;
  };
}

export function ConfiguratorProvider({
  className,
  initialConfiguration,
  currentLayerId: currentLayerIdProp,
  onCurrentLayerIdChange,
  configuration: configurationProp,
  onConfigurationChange,
  children,
}: ConfiguratorProviderProps) {
  const getInitialState = (): ConfiguratorState => {
    if (configurationProp) {
      return {
        configuration: configurationProp,
        history: [configurationProp],
        historyIndex: 0,
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // TODO: Handle JSON parse error (e.g., log it)
    }

    return {
      configuration: initialConfiguration,
      history: [initialConfiguration],
      historyIndex: 0,
    };
  };

  const [state, dispatch] = useReducer(
    withPersistence(configuratorReducer),
    undefined,
    getInitialState
  );
  const [sidebarView, setSidebarView] = useState<SidebarView>('home');
  // Controlled/uncontrolled currentLayerId
  const [internalCurrentLayerId, setInternalCurrentLayerId] = useState<string | undefined>(
    undefined
  );
  const [selectedElementId, _setSelectedElementId] = useState<string | undefined>(undefined);

  const canvasRef = useRef<Canvas | null>(null);
  const canvasCenterPos = useMemo(() => {
    if (!canvasRef.current) {
      console.warn('Cannot calculate canvas center position: canvas is not initialized');
      return { x: 0, y: 0 };
    }
    return { x: canvasRef.current.getWidth() / 2, y: canvasRef.current?.getHeight() / 2 };
  }, [canvasRef.current]);

  // Sync controlled configuration changes to state
  useEffect(() => {
    if (configurationProp) {
      dispatch({ type: 'SET_CONFIGURATION', payload: configurationProp });
    }
  }, [configurationProp]);

  /**
   * Applies a state update to the current configuration and optionally synchronizes visual changes on the Fabric.js canvas.
   *
   * This utility ensures centralized control over configuration updates, maintaining undo/redo history,
   * state persistence (e.g., in localStorage), and optional fine-grained visual updates on the canvas.
   *
   * @param updater - A function that receives the previous Configuration and the current layer,
   *                  returning a new Configuration. This new configuration is stored in state and persisted.
   *
   * @param applyVisualChanges - Optional. A function that receives the Fabric.js canvas instance and the new Configuration.
   *                             Use this to apply selective, efficient updates to the canvas (e.g., updating a single object).
   *                             If omitted, only the state will be updated without visual side effects.
   *
   * @remarks
   * - This function assumes a valid `currentLayer` exists. If not, it logs a warning and aborts.
   * - If canvas is not initialized when `applyVisualChanges` is provided, the visual update is skipped with a warning.
   *
   * @example
   * performConfigurationUpdate(
   *   (prevConfig, currentLayer) =>
   *     updateColorItemColor(prevConfig, currentLayer.id, itemId, newColor),
   *   (canvas, newConfig) => {
   *     const item = findFabricObjectForItem(canvas, currentLayer.id, itemId);
   *     if (item) {
   *       item.set('fill', newColor);
   *       canvas.requestRenderAll();
   *     }
   *   }
   * );
   */

  function performConfigurationUpdate(
    updater: (prevConfig: Configuration, currentLayer: TemplateLayer) => Configuration,
    applyVisualChanges?: (canvas: Canvas, newConfig: Configuration) => void
  ) {
    if (!currentLayer) {
      console.error('No current layer set, skipping configuration update');
      return;
    }
    const newConfig = updater(state.configuration, currentLayer);
    setConfiguration(newConfig); // triggers reducer + history + localStorage

    if (applyVisualChanges) {
      if (!canvasRef.current) {
        console.error('Canvas is not initialized, skipping visual updates on configuration update');
        return;
      }
      applyVisualChanges(canvasRef.current, newConfig);
    }
  }

  // Controlled/uncontrolled configuration setter
  function setConfiguration(config: Configuration) {
    if (onConfigurationChange) {
      onConfigurationChange(config);
    }
    if (!configurationProp) {
      dispatch({ type: 'SET_CONFIGURATION', payload: config });
    }
  }

  const currentLayerId =
    currentLayerIdProp !== undefined ? currentLayerIdProp : internalCurrentLayerId;

  const currentLayer = useMemo(() => {
    return state.configuration.layers.find((l) => l.id === currentLayerId) ?? undefined;
  }, [state.configuration.layers, currentLayerId]);

  function setCurrentLayerId(id: string | undefined) {
    if (onCurrentLayerIdChange) onCurrentLayerIdChange(id);
    if (currentLayerIdProp === undefined) setInternalCurrentLayerId(id);
    setSidebarView(id ? 'current-layer' : 'home');
    _setSelectedElementId(undefined);

    const newCurrentLayer = state.configuration.layers.find((l) => l.id === id);
    if (newCurrentLayer) {
      if (!canvasRef.current) {
        console.error('Canvas is not initialized, skipping layer toggle');
        return;
      }

      // Deactivate all other layers' fabric objects
      const layerIdsToDeactivate = state.configuration.layers
        .filter((l) => l.id !== id)
        .map((l) => l.id);
      deactivateFabricObjectsInConfigurationByLayerIds(
        canvasRef.current,
        state.configuration,
        layerIdsToDeactivate
      );

      // Activate fabric objects in the new current layer
      switch (newCurrentLayer.type) {
        case 'color':
          // Allow color elements to be selected
          activateFabricObjectsInLayerColor(
            canvasRef.current,
            newCurrentLayer,
            (colorItemId: string) => {
              setSelectedElementId(colorItemId);
            }
          );
          break;
        case 'image':
          // Allow image elements to be selected, moved, rotated, scaled, etc.
          activateFabricObjectsInLayerImage(canvasRef.current, newCurrentLayer, {
            onModified: (modifiedImage) => {
              setConfiguration(updateImage(state.configuration, modifiedImage));
            },
          });
          break;
        case 'text':
          break;
      }
    }
  }

  const selectedElement: SelectedElement | undefined = useMemo(() => {
    if (!currentLayer || !selectedElementId) return undefined;

    switch (currentLayer?.type) {
      case 'color':
        const element = findColorElementById(currentLayer.colorElements, selectedElementId);
        return element ? { type: 'color-element', element } : undefined;
      case 'image':
        return undefined;
      case 'text':
        return undefined;
      default:
        return undefined;
    }
  }, [selectedElementId, currentLayer]);

  function setSelectedElementId(id: string | undefined) {
    _setSelectedElementId(id);
    setSidebarView(id ? 'selected-element' : 'current-layer');
  }

  function setCanvas(canvas: Canvas) {
    canvasRef.current = canvas;
  }

  function undo(applyVisualChanges?: (canvas: Canvas, config: Configuration) => void) {
    if (!canUndo) return;

    const { history, historyIndex } = state;
    const newConfig = history[historyIndex - 1];

    dispatch({ type: 'UNDO' });

    if (applyVisualChanges) {
      if (!canvasRef.current) {
        console.error('Canvas is not initialized, skipping visual updates on undo');
        return;
      }
      applyVisualChanges(canvasRef.current, newConfig);
    }
  }

  function redo(applyVisualChanges?: (canvas: Canvas, config: Configuration) => void) {
    if (!canRedo) return;

    const { history, historyIndex } = state;
    const newConfig = history[historyIndex + 1];

    dispatch({ type: 'REDO' });

    if (applyVisualChanges) {
      if (!canvasRef.current) {
        console.error('Canvas is not initialized, skipping visual updates on redo');
        return;
      }
      applyVisualChanges(canvasRef.current, newConfig);
    }
  }

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <ConfiguratorContext.Provider
      value={{
        configuration: state.configuration,
        setConfiguration,
        performConfigurationUpdate,
        setCanvas,
        canvasCenterPos,
        sidebarView,
        setSidebarView,
        currentLayer,
        setCurrentLayerId,
        selectedElement,
        setSelectedElementId,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      <div className={cn('clab-configurator relative grid h-screen w-screen', className)}>
        {children}
      </div>
    </ConfiguratorContext.Provider>
  );
}

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfiguratorContext must be used inside ConfiguratorProvider');
  }
  return context;
};
