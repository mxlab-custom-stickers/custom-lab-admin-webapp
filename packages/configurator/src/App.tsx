import Canvas from '@/components/Canvas/Canvas.tsx';
import LayersMenu from '@/components/LayersMenu';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/Toolbar';
import { ConfiguratorProvider } from '@/contexts/configurator-contexts.tsx';
import { getTemplateById } from '@clab/firebase';
import type { Template } from '@clab/types';
import { useEffect, useState } from 'react';

const TEMPLATE_ID = '7aGiCh9Gvngl1CZPTNY3p';

export default function App() {
  const [template, setTemplate] = useState<Template>();

  useEffect(() => {
    getTemplateById(TEMPLATE_ID).then(setTemplate);
  }, []);

  return (
    <div className="dark bg-[url('assets/background.png')] bg-contain bg-[calc(50%+(272px/2)-(16px/2))_calc(50%-(64px/2))] bg-no-repeat">
      {template ? (
        <ConfiguratorProvider className="grid h-screen w-screen" template={template}>
          <Sidebar />
          <div className="relative">
            <Canvas />
            <Toolbar />
          </div>
          <LayersMenu />
        </ConfiguratorProvider>
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
}
