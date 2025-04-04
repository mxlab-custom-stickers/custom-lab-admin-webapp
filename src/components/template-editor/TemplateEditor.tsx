import Configurator from '@/components/configurator/Configurator.tsx';
import ConfiguratorSidebar from '@/components/configurator/ConfiguratorSidebar.tsx';
import ConfiguratorLayersBar from '@/components/configurator/LayersBar.tsx';
import ConfiguratorSvg from '@/components/configurator/Svg.tsx';
import TemplateEditorSidebar from '@/components/template-editor/TemplateEditorSidebar.tsx';
import { Button } from '@/components/ui/button.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar.tsx';
import { TemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { COLOR_PALETTES_FIXTURE } from '@/fixtures/color-palettes.fixture.ts';
import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import { Template } from '@/models/template.ts';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function TemplateEditor() {
  const { id } = useParams({ strict: false });

  const [template, _setTemplate] = useState<Template>(getTemplate);

  function getTemplate(): Template {
    const json = localStorage.getItem(`edit-template:${id}`);
    if (json) {
      return JSON.parse(json) as Template;
    }

    const newTemplate = {
      id: id!,
      name: 'Nouveau template',
      svgUrl: 'KTM_2024_lab1.svg',
      layers: [],
      tags: [],
      attributes: [],
      createdAt: new Date().toLocaleDateString('fr'),
      createdBy: '',
    };
    localStorage.setItem(`template:${id}`, JSON.stringify(newTemplate));
    return newTemplate;
  }

  function setTemplate(template: Template) {
    _setTemplate(template);
    localStorage.setItem(`template:${id}`, JSON.stringify(template));
  }

  return (
    <TemplateEditorContext.Provider
      value={{
        allColorPalettes: COLOR_PALETTES_FIXTURE,
        allColors: COLORS_FIXTURE,
      }}
    >
      <Configurator template={template} onTemplateChange={setTemplate}>
        <SidebarProvider>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
              <Button asChild>
                <Link to="/templates">
                  <ArrowLeft /> Retour
                </Link>
              </Button>
              <InvisibleInput
                className="text-center !text-lg font-medium"
                value={template.name}
              />
              <SidebarTrigger className="-mr-1 rotate-180" />
            </header>

            <div className="grid h-full grid-cols-[min-content_auto]">
              <ConfiguratorSidebar />
              <div className="flex flex-col justify-center">
                <ConfiguratorSvg wrapperClassName="flex-1 [&_div]:h-full" />
                <ConfiguratorLayersBar />
              </div>
            </div>
          </SidebarInset>

          <TemplateEditorSidebar />
        </SidebarProvider>
      </Configurator>
    </TemplateEditorContext.Provider>
  );
}
