import { App } from '@/models/settings.ts';
import { createContext, useContext } from 'react';

type AppContextType = {
  apps: App[];

  currentApp: App;
  setCurrentApp: (app: App) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);
