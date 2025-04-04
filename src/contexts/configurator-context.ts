import { EditTemplate } from '@/models/template.ts';
import { createContext } from 'react';

type ConfiguratorContextType = {
  template: EditTemplate;
  currentLayerId: string;
};

export const ConfiguratorContext = createContext<ConfiguratorContextType>(
  {} as ConfiguratorContextType
);
