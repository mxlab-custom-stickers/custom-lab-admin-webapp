import { configuratorReducer } from '@/contexts/configurator/configurator-reducer.ts';
import type {
  ConfiguratorContextType,
  ConfiguratorState,
  SelectedElement,
  SidebarView,
} from '@/contexts/configurator/configurator-types.ts';
import { type Configuration } from '@clab/types';
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
      console.warn('Failed to persist configurator state:', err);
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

  // Sync controlled configuration changes to state
  useEffect(() => {
    if (configurationProp) {
      dispatch({ type: 'SET_CONFIGURATION', payload: configurationProp });
    }
  }, [configurationProp]);

  /**
   * Updates the current configuration state by applying an updater function, and optionally
   * performs targeted visual updates on the canvas.
   *
   * This function centralizes state updates and visual synchronization, ensuring undo/redo
   * history is maintained and that the UI reflects changes efficiently.
   *
   * @param updater - A function that receives the previous Configuration and returns the new updated Configuration.
   *                  This update will be applied to the state and persisted (e.g., localStorage).
   *
   * @param applyVisualChanges - Optional. A function that receives the current Fabric.js canvas instance (or null if not initialized)
   *                             and the new Configuration. This should perform any selective visual updates necessary
   *                             (e.g., updating a single canvas object instead of full re-render).
   *                             If omitted, only the state is updated.
   *
   * @example
   * performConfigurationUpdate(
   *   prevConfig => updateColorItemColor(prevConfig, layerId, itemId, newColor),
   *   (canvas, config) => {
   *     // selectively update canvas objects here
   *   }
   * );
   */
  function performConfigurationUpdate(
    updater: (prevConfig: Configuration) => Configuration,
    applyVisualChanges?: (canvas: Canvas, newConfig: Configuration) => void
  ) {
    const newConfig = updater(state.configuration);
    setConfiguration(newConfig); // triggers reducer + history + localStorage

    if (applyVisualChanges) {
      if (!canvasRef.current) {
        console.warn('Canvas is not initialized, skipping visual updates on configuration update');
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
        console.warn('Canvas is not initialized, skipping visual updates on undo');
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
        console.warn('Canvas is not initialized, skipping visual updates on redo');
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
        performConfigurationUpdate,
        canvasRef,
        setCanvas,
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
