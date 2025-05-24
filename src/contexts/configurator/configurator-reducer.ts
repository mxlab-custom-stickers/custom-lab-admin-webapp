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
    case 'SET_CURRENT_LAYER': {
      return { ...state, currentLayer: action.payload };
    }
    case 'SET_CURRENT_COLOR_ELEMENT': {
      return { ...state, currentColorElement: action.payload };
    }
    default: {
      return state;
    }
  }
}
