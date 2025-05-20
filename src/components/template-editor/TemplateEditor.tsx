import ConfiguratorSidebar from '@/components/configurator/ConfiguratorSidebar.tsx';
import ConfiguratorLayersBar from '@/components/configurator/LayersBar.tsx';
import ConfiguratorSvg from '@/components/configurator/Svg.tsx';
import TemplateEditorHeader from '@/components/template-editor/TemplateEditorHeader.tsx';
import TemplateEditorSidebar from '@/components/template-editor/TemplateEditorSidebar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { ConfiguratorProvider } from '@/contexts/configurator/configurator-context.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import PreviewModeWrapper from './PreviewModeWrapper';

export default function TemplateEditor() {
  const {
    state: { template, previewMode },
  } = useTemplateEditorContext();

  return (
    <ConfiguratorProvider template={template}>
      <SidebarProvider
        className="flex flex-col"
        open={previewMode !== 'fullscreen'}
      >
        <TemplateEditorHeader />

        <div className="flex flex-1">
          <SidebarInset>
            <div className="grid h-full w-full place-items-center bg-gray-300 p-1.5">
              <PreviewModeWrapper className="@container overflow-hidden rounded-lg">
                <div className="grid h-full grid-cols-[min-content_auto] grid-rows-[1fr_min-content] @max-[385px]:grid-cols-1">
                  <ConfiguratorSidebar className="row-span-2 @max-[385px]:w-full" />
                  <ConfiguratorSvg wrapperClassName="bg-white @max-[385px]:order-first [&_div]:h-full" />
                  <ConfiguratorLayersBar />
                </div>
              </PreviewModeWrapper>
            </div>
          </SidebarInset>

          <TemplateEditorSidebar />
        </div>
      </SidebarProvider>
    </ConfiguratorProvider>
  );
}
