import InvisibleInput from '@/components/forms/InvisibleInput.tsx';
import AddLayerDropdown from '@/components/Sidebar/AddLayerDropdown.tsx';
import LayerColorComponent from '@/components/Sidebar/LayerColor/LayerColorComponent.tsx';
import LayerTextComponent from '@/components/Sidebar/LayerText/LayerTextComponent.tsx';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  Sidebar as SidebarUI,
} from '@/components/ui/sidebar.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor-context.tsx';
import type { TemplateLayerType } from '@clab/types';
import type { ReactNode } from 'react';

const currentLayerComponents: Record<TemplateLayerType, ReactNode> = {
  color: <LayerColorComponent />,
  image: <div>Image Layer</div>,
  text: <LayerTextComponent />,
  background: <div>Background Layer</div>,
};

export default function Sidebar() {
  const { currentLayer, updateLayer } = useTemplateEditorContext();

  function updateCurrentLayerName(name: string) {
    if (!currentLayer) return;
    updateLayer({ ...currentLayer, name });
  }

  return (
    <SidebarUI side="right" className="top-14 !h-[calc(100svh-3.5rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="relative">
            <div className="flex flex-col gap-3">
              <AddLayerDropdown />
              {currentLayer ? (
                <>
                  <InvisibleInput
                    className="!text-lg font-semibold"
                    defaultValue={currentLayer.name}
                    onValueSubmit={updateCurrentLayerName}
                  />
                  {currentLayerComponents[currentLayer.type]}
                </>
              ) : null}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  );
}
