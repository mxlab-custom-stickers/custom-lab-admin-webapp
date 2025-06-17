import { AppContext } from '@/contexts/app-context';
import { getApps } from '@/lib/firebase/firestore.ts';
import { App } from '@/models/settings.ts';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [currentApp, _setCurrentApp] = useState<App | undefined>(getCurrentApp);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function getCurrentApp(): App | undefined {
    const app = localStorage.getItem('custom-lab-admin:current-app');
    if (app) {
      return JSON.parse(app);
    }
    return undefined;
  }

  function setCurrentApp(app: App) {
    _setCurrentApp(app);
    localStorage.setItem('custom-lab-admin:current-app', JSON.stringify(app));
  }

  useEffect(() => {
    getApps().then((apps) => {
      setApps(apps);
      if (!currentApp && apps.length > 0) {
        setCurrentApp(apps[0]);
      }
    });
  }, []);

  return currentApp ? (
    <AppContext.Provider value={{ apps, currentApp, setCurrentApp, loading, setLoading }}>
      <Outlet />
      {/*<TanStackRouterDevtools />*/}
    </AppContext.Provider>
  ) : (
    <div>Chargement...</div>
  );
}
