import React, { createContext, useContext } from 'react';

export const ConfiguratorContext = createContext<{} | null>(null);

export function ConfiguratorProvider({ children }: { children: React.ReactNode }) {
  return <ConfiguratorContext.Provider value={{}}>{children}</ConfiguratorContext.Provider>;
}

export const useConfiguratorContext = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfiguratorContext must be used inside ConfiguratorProvider');
  }
  return context;
};
