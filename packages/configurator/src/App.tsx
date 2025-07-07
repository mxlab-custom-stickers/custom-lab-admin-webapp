import Canvas from '@/components/Canvas';
import LayersMenu from '@/components/LayersMenu';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/Toolbar';
import { ConfiguratorProvider } from '@/contexts/configurator-contexts.tsx';
import { getTemplateById } from '@clab/firebase';
import type { Configuration, Template } from '@clab/types';
import { useEffect, useState } from 'react';

const TEMPLATE_ID = 'JpahtGZzSNhpymmYpQPBN';

export default function App() {
  const [configuration, setConfiguration] = useState<Configuration>();

  useEffect(() => {
    const configuration = localStorage.getItem('configuration');
    if (!configuration) {
      getTemplateById(TEMPLATE_ID).then((template) => {
        if (!template) return;

        const newConfiguration: Configuration = {
          id: 'configuration',
          template,
          createdAt: new Date().toISOString(),
        };
        setConfiguration(newConfiguration);
        localStorage.setItem('configuration', JSON.stringify(newConfiguration));
      });
    } else {
      setConfiguration(JSON.parse(configuration));
    }
  }, []);

  function handleTemplateChange(updatedTemplate: Template) {
    if (!configuration) return;

    setConfiguration({ ...configuration, template: updatedTemplate });
    localStorage.setItem(
      'configuration',
      JSON.stringify({ ...configuration, template: updatedTemplate })
    );
  }

  return (
    <div className="dark bg-[url('assets/background.png')] bg-contain bg-[calc(50%+(272px/2)-(16px/2))_calc(50%-(64px/2))] bg-no-repeat">
      {configuration ? (
        <ConfiguratorProvider
          className="grid h-screen w-screen"
          template={configuration.template}
          onTemplateChange={handleTemplateChange}
        >
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
