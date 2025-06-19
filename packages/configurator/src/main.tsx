import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar.tsx';
import { ConfiguratorProvider } from './contexts/configurator-contexts.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfiguratorProvider>
      <Sidebar />
    </ConfiguratorProvider>
  </StrictMode>
);
