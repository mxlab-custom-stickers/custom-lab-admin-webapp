import type { App } from '@clab/types';
import { type User } from 'firebase/auth';

export type AppContextType = {
  user: User;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  apps: App[];
  currentApp: App | undefined;
  setCurrentApp: (app: App) => void;
};
