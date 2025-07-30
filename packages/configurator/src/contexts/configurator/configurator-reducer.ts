import { MAX_HISTORY_LENGTH } from '@/contexts/configurator/configurator-contexts.tsx';
import type {
  ConfiguratorAction,
  ConfiguratorState,
} from '@/contexts/configurator/configurator-types.ts';

export function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction) {
  console.debug('Reducer action:', action.type);

  switch (action.type) {
    case 'SET_CONFIGURATION': {
      const newConfig = action.payload;
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newConfig];

      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.shift(); // remove the oldest
      }

      return {
        configuration: newConfig,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;

      return {
        ...state,
        configuration: state.history[state.historyIndex - 1],
        historyIndex: state.historyIndex - 1,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;

      return {
        ...state,
        configuration: state.history[state.historyIndex + 1],
        historyIndex: state.historyIndex + 1,
      };
    }

    default:
      return state;
  }
}
