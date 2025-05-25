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
    case 'SET_CURRENT_COLOR_ELEMENT_ID': {
      return { ...state, currentColorElementId: action.payload };
    }
    case 'SET_CANVAS': {
      return { ...state, canvas: action.payload };
    }
    case 'SET_COLOR_ITEM_MAP': {
      return { ...state, colorItemMap: action.payload };
    }
    default: {
      return state;
    }
  }
}
