import ConfiguratorCanvas from '@/components/Canvas/ConfiguratorCanvas.tsx';
import LayersMenubar from '@/components/layers-menubar/LayersMenubar.tsx';
import LayersMenubarItemList from '@/components/layers-menubar/LayersMenubarItemList.tsx';
import Sidebar from '@/components/sidebar/Sidebar.tsx';
import SidebarContent from '@/components/sidebar/SidebarContent.tsx';
import SidebarFooter from '@/components/sidebar/SidebarFooter.tsx';
import SidebarHeader from '@/components/sidebar/SidebarHeader.tsx';
import Toolbar from '@/components/toolbar/Toolbar.tsx';
import UndoRedoControls from '@/components/toolbar/UndoRedoControls.tsx';
import { ConfiguratorProvider } from '@/contexts/configurator/configurator-contexts.tsx';
import { getTemplateById } from '@clab/firebase';
import type { Configuration } from '@clab/types';
import { createConfigurationFromTemplate } from '@clab/utils';
import { useEffect, useState } from 'react';

const TEMPLATE_ID = 'JpahtGZzSNhpymmYpQPBN';

export default function App() {
  const [configuration, setConfiguration] = useState<Configuration>();

  useEffect(() => {
    getTemplateById(TEMPLATE_ID)
      .then((template) => {
        if (!template) return;
        setConfiguration(createConfigurationFromTemplate(template));
      })
      .catch(() => {
        // TODO: Handle error (e.g., show a notification)
        // logError(err);
      });
  }, []);

  return configuration ? (
    <div className="dark h-screen w-screen bg-[url('assets/background.png')] bg-contain bg-[calc(50%+(272px/2)-(16px/2))_calc(50%-(64px/2))] bg-no-repeat">
      <ConfiguratorProvider initialConfiguration={configuration}>
        <Sidebar>
          <SidebarHeader />
          <SidebarContent />
          <SidebarFooter />
        </Sidebar>
        <Toolbar>
          <UndoRedoControls />
        </Toolbar>
        <ConfiguratorCanvas offsetX={275} offsetY={-75} />
        <LayersMenubar>
          <LayersMenubarItemList />
        </LayersMenubar>
      </ConfiguratorProvider>
    </div>
  ) : // TODO: Add loading state
  null;
}
