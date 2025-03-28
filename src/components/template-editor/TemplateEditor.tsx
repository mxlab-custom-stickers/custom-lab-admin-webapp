import LayersBar from '@/components/configurator/LayersBar.tsx';
import ConfiguratorSidebar from '@/components/configurator/Sidebar.tsx';
import { Svg } from '@/components/svg.tsx';
import SvgLayerPicker from '@/components/template-editor/SvgLayerPicker.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar.tsx';
import { TemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { focusElement, unfocusElement } from '@/lib/svg.ts';
import { svgLayerToTemplateLayerColor } from '@/lib/template-editor.ts';
import { SvgLayer } from '@/models/svg.ts';
import { EditTemplate } from '@/models/template.ts';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';

export default function TemplateEditor() {
  const { id } = useParams({ strict: false });

  const [template, setTemplate] = useState<EditTemplate>(getTemplate);
  const [injecting, setInjecting] = useState<boolean>(true);

  function getTemplate(): EditTemplate {
    const json = localStorage.getItem(`edit-template:${id}`);
    if (json) {
      return JSON.parse(json) as EditTemplate;
    }

    const newTemplate = {
      id: id!,
      name: 'Nouveau template',
      svgUrl: 'KTM_2024_lab1.svg',
      layers: [],
      tags: [],
      attributes: [],
    };
    localStorage.setItem(`edit-template:${id}`, JSON.stringify(newTemplate));
    return newTemplate;
  }

  function handleSelectLayer(layer?: SvgLayer) {
    unfocusElement(template.id);
    if (layer) {
      focusElement(template.id, layer.id);

      setTemplate({
        ...template,
        layers: [svgLayerToTemplateLayerColor(layer)],
      });
    } else {
      setTemplate({ ...template, layers: [] });
    }
  }

  return (
    <TemplateEditorContext.Provider value={{ template, setTemplate }}>
      <SidebarProvider>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
          </header>
          <div className="grid grid-cols-[min-content_auto]">
            <ConfiguratorSidebar template={template} />
            <div>
              <Svg afterInjection={() => setInjecting(false)} />
              <LayersBar template={template} />
            </div>
          </div>
        </SidebarInset>

        <Sidebar side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {!injecting ? (
                  <SvgLayerPicker
                    svgId={template.id}
                    onSelectLayer={handleSelectLayer}
                  />
                ) : null}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </TemplateEditorContext.Provider>
  );
}
