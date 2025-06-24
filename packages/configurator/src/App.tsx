import Canvas from '@/components/Canvas';
import LayersMenu from '@/components/LayersMenu';
import Sidebar from '@/components/Sidebar';
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
          <Sidebar className="w-68 fixed bottom-4 left-4 top-4 z-30 bg-[#323232] shadow-xl" />
          <div className="relative">
            <Canvas />
          </div>
          <LayersMenu className="h-13 fixed bottom-7 left-72 right-0 z-20 bg-[#323232] p-2 text-white shadow-xl" />
        </ConfiguratorProvider>
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
}
