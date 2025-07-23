import type { AppContextType } from '@/contexts/app-types.ts';
import { getUserApps } from '@clab/firebase';
import type { App } from '@clab/types';
import { type User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext<AppContextType | null>(null);

type AppProviderProps = {
  user: User;
  children: React.ReactNode;
};

export function AppProvider({ user, children }: AppProviderProps) {
  const [currentApp, _setCurrentApp] = useState<App | undefined>(getCurrentApp);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function getCurrentApp(): App | undefined {
    const app = localStorage.getItem('custom-lab-admin:current-app');
    if (app) return JSON.parse(app);
    return undefined;
  }

  function setCurrentApp(app: App) {
    _setCurrentApp(app);
    localStorage.setItem('custom-lab-admin:current-app', JSON.stringify(app));
  }

  useEffect(() => {
    setLoading(true);

    getUserApps(user.uid)
      .then((apps) => {
        setApps(apps);
        if (!currentApp && apps.length > 0) {
          setCurrentApp(apps[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <div>Chargement...</div>
  ) : (
    <AppContext.Provider value={{ user, apps, currentApp, setCurrentApp, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
