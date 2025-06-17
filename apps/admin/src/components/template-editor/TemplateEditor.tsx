import ConfiguratorCanvas from '@/components/configurator/ConfiguratorCanvas.tsx';
import ConfiguratorSidebar from '@/components/configurator/ConfiguratorSidebar/ConfiguratorSidebar.tsx';
import ConfiguratorLayersBar from '@/components/configurator/LayersBar.tsx';
import ConfiguratorToolbar from '@/components/configurator/Toolbar/Toolbar.tsx';
import TemplateEditorLayout from '@/components/template-editor/TemplateEditorLayout.tsx';
import { Configurator } from '@/contexts/configurator/configurator-context.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';

export default function TemplateEditor() {
  const {
    state: { template, currentLayerId },
  } = useTemplateEditorContext();

  return (
    <TemplateEditorLayout>
      <Configurator template={template} currentLayerId={currentLayerId}>
        <div className={cn('grid h-full grid-cols-[min-content_auto] grid-rows-[1fr_min-content]')}>
          <ConfiguratorSidebar />

          <div className="relative">
            <ConfiguratorCanvas />
            <ConfiguratorToolbar />
          </div>

          <ConfiguratorLayersBar />
        </div>
      </Configurator>
    </TemplateEditorLayout>
  );
}
