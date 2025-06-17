import AddLayerDropdownMenu from '@/components/template-editor/AddLayerDropdownMenu.tsx';
import DeleteCurrentLayerButton from '@/components/template-editor/DeleteCurrentLayerButton.tsx';
import EditTemplateLayerColorComponent from '@/components/template-editor/EditTemplateLayerColor/EditTemplateLayerColorComponent.tsx';
import EditTemplateLayerImageComponent from '@/components/template-editor/EditTemplateLayerImage/EditTemplateLayerImageComponent.tsx';
import EditTemplateLayerTextComponent from '@/components/template-editor/EditTemplateLayerText/EditTemplateLayerTextComponent.tsx';
import InvisibleInput from '@/components/ui/InvisibleInput.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { TemplateLayerType } from '@/models/template.ts';
import { ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <EditTemplateLayerColorComponent />,
  image: <EditTemplateLayerImageComponent />,
  text: <EditTemplateLayerTextComponent />,
  background: <div>Background Layer</div>,
};

export default function TemplateEditorSidebar() {
  const { currentLayer, updateLayer } = useTemplateEditorContext();

  function updateCurrentLayerName(name: string) {
    if (!currentLayer) return;
    updateLayer({ ...currentLayer, name });
  }

  return (
    <Sidebar side="right" className="top-14 !h-[calc(100svh-56px)]">
      <SidebarContent className="h-full bg-gray-100">
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="relative h-full">
            <div className="flex flex-col gap-3">
              <AddLayerDropdownMenu />
              {currentLayer ? (
                <>
                  <InvisibleInput
                    className="!text-lg font-semibold"
                    value={currentLayer.name}
                    onValueSubmit={updateCurrentLayerName}
                  />
                  {currentLayerComponents[currentLayer.type]}
                </>
              ) : null}
            </div>

            <DeleteCurrentLayerButton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
