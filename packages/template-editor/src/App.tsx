import {
  ConfiguratorCanvas,
  ConfiguratorLayersMenu,
  ConfiguratorProvider,
  ConfiguratorSidebar,
} from '@clab/configurator';

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
    <div>
      {template ? (
        <ConfiguratorProvider className="relative grid h-screen w-screen" template={template}>
          <ConfiguratorSidebar className="absolute" />
          <div className="relative">
            <ConfiguratorCanvas />
          </div>
          <ConfiguratorLayersMenu className="absolute" />
        </ConfiguratorProvider>
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
}
