import Layout from '@/components/Layout/Layout.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import {
  ConfiguratorCanvas,
  ConfiguratorLayersMenu,
  ConfiguratorProvider,
  ConfiguratorSidebar,
} from '@clab/configurator';

export default function TemplateEditor() {
  const {
    state: { template, currentLayerId },
    updateTemplate,
    setCurrentLayerId,
  } = useTemplateEditorContext();

  return (
    <Layout>
      <ConfiguratorProvider
        className="h-full w-full"
        template={template}
        onTemplateChange={updateTemplate}
        currentLayerId={currentLayerId}
        onCurrentLayerIdChange={setCurrentLayerId}
      >
        <div className="grid h-full w-full flex-1 grid-cols-[min-content_auto] grid-rows-[1fr_min-content]">
          <ConfiguratorSidebar
            className="static row-span-2 rounded-none border-r bg-white text-black shadow-none"
            classNames={{ header: 'hidden', footer: 'hidden' }}
          />
          <div className="relative">
            <ConfiguratorCanvas />
          </div>
          <ConfiguratorLayersMenu className="static border-t bg-white text-black shadow-none" />
        </div>
      </ConfiguratorProvider>
    </Layout>
  );
}
