import type { ConfiguratorAction, ConfiguratorState } from '@/contexts/configurator-types.ts';

export function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction) {
  switch (action.type) {
    case 'SET_TEMPLATE': {
      return { ...state, template: action.payload };
    }
    case 'SET_CURRENT_LAYER_ID': {
      return { ...state, currentLayerId: action.payload };
    }
    case 'SET_SIDEBAR_VIEW': {
      return { ...state, sidebarView: action.payload };
    }
    case 'SET_SELECTED_COLOR_ELEMENT_ID': {
      return { ...state, selectedColorElementId: action.payload };
    }
    case 'SET_SELECTED_OBJECT_ID': {
      return { ...state, selectedObjectId: action.payload };
    }
    case 'SET_CANVAS': {
      return { ...state, canvas: action.payload };
    }
    default: {
      return state;
    }
  }
}
