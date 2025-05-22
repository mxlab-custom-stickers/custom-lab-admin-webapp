import {
  ConfiguratorAction,
  ConfiguratorState,
} from '@/contexts/configurator/configurator-types.ts';

export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction
) {
  switch (action.type) {
    case 'SET_TEMPLATE': {
      return { ...state, template: action.payload };
    }
    case 'SET_CURRENT_LAYER_ID': {
      return { ...state, currentLayerId: action.payload };
    }
    case 'SET_CURRENT_COLOR_ELEMENT': {
      return { ...state, currentColorElement: action.payload };
    }
    case 'UPDATE_CURRENT_COLOR_ELEMENT': {
      return { ...state, currentColorElement: action.payload };
    }
    default: {
      return state;
    }
  }
}
