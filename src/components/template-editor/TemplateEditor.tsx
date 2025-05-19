import Configurator from '@/components/configurator/Configurator.tsx';
import ConfiguratorSidebar from '@/components/configurator/ConfiguratorSidebar.tsx';
import ConfiguratorLayersBar from '@/components/configurator/LayersBar.tsx';
import ConfiguratorSvg from '@/components/configurator/Svg.tsx';
import TemplateEditorHeader from '@/components/template-editor/TemplateEditorHeader.tsx';
import TemplateEditorSidebar from '@/components/template-editor/TemplateEditorSidebar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import {
  PreviewMode,
  TemplateEditorContext,
} from '@/contexts/template-editor-context.ts';
import { COLOR_PALETTES_FIXTURE } from '@/fixtures/color-palettes.fixture.ts';
import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import { Template } from '@/models/template.ts';
import { useState } from 'react';
import PreviewModeWrapper from './PreviewModeWrapper';

type TemplateEditorProps = {
  template: Template;
  onTemplateChange: (template: Template) => void;
};

export default function TemplateEditor({
  template,
  onTemplateChange,
}: TemplateEditorProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [showSvgLayerPicker, setShowSvgLayerPicker] = useState<boolean>(false);

  return (
    <TemplateEditorContext.Provider
      value={{
        allColorPalettes: COLOR_PALETTES_FIXTURE,
        allColors: COLORS_FIXTURE,
        previewMode,
        setPreviewMode,
        showSvgLayerPicker,
        setShowSvgLayerPicker,
      }}
    >
      <Configurator template={template} onTemplateChange={onTemplateChange}>
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
      </Configurator>
    </TemplateEditorContext.Provider>
  );
}
