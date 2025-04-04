import TemplateLayerColorForm from '@/components/template-editor/TemplateLayerColorForm.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { focusElement, unfocusElement } from '@/lib/svg.ts';
import { svgLayerToTemplateLayerColor } from '@/lib/template-editor.ts';
import { SvgLayer } from '@/models/svg.ts';

export default function TemplateEditorSidebar() {
  const { template, setTemplate, svgInjecting, allColors, allColorPalettes } =
    useTemplateEditorContext();

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
    <Sidebar side="right">
      <SidebarContent className="bg-gray-100">
        <SidebarGroup className="pb-0">
          <SidebarGroupContent>
            {/*<Button className="w-full">Ajouter un calque</Button>*/}
            {/*{!svgInjecting ? (*/}
            {/*  <div>*/}
            {/*    <SvgLayerPicker*/}
            {/*      className="pb-2"*/}
            {/*      svgId={template.id}*/}
            {/*      onSelectLayer={handleSelectLayer}*/}
            {/*    />*/}
            {/*    <div className="bg-sidebar sticky bottom-0 p-2">*/}
            {/*      <Button className="w-full">Ajouter le calque</Button>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*) : null}*/}
            <TemplateLayerColorForm
              allColors={allColors ?? []}
              allColorPalettes={allColorPalettes ?? []}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
