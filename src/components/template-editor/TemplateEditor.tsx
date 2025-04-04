import Configurator from '@/components/configurator/Configurator.tsx';
import TemplateEditorSidebar from '@/components/template-editor/TemplateEditorSidebar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar.tsx';
import { TemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { COLOR_PALETTES_FIXTURE } from '@/fixtures/color-palettes.fixture.ts';
import { COLORS_FIXTURE } from '@/fixtures/colors.fixture.ts';
import { focusElement, unfocusElement } from '@/lib/svg.ts';
import { svgLayerToTemplateLayerColor } from '@/lib/template-editor.ts';
import { SvgLayer } from '@/models/svg.ts';
import { EditTemplate } from '@/models/template.ts';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function TemplateEditor() {
  const { id } = useParams({ strict: false });

  const [template, setTemplate] = useState<EditTemplate>(getTemplate);
  const [svgInjecting, setSvgInjecting] = useState<boolean>(true);

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
    <TemplateEditorContext.Provider
      value={{
        template,
        setTemplate,
        svgInjecting,
        allColors: COLORS_FIXTURE,
        allColorPalettes: COLOR_PALETTES_FIXTURE,
      }}
    >
      <SidebarProvider>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <Button asChild>
              <Link to="/templates">
                <ArrowLeft /> Retour
              </Link>
            </Button>
            <div className="font-medium">{template.name}</div>
            <SidebarTrigger className="-mr-1 rotate-180" />
          </header>

          <Configurator
            template={template}
            afterSvgInjection={() => setSvgInjecting(false)}
          />
        </SidebarInset>

        <TemplateEditorSidebar />
      </SidebarProvider>
    </TemplateEditorContext.Provider>
  );
}
