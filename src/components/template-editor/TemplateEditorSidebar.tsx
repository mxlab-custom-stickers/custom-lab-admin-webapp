import CurrentLayerComponent from '@/components/template-editor/CurrentLayerComponent.tsx';
import DeleteCurrentLayerButton from '@/components/template-editor/DeleteCurrentLayerButton.tsx';
import NewLayerDropdownMenu from '@/components/template-editor/NewLayerDropdownMenu.tsx';
import SvgLayerPicker from '@/components/template-editor/SvgLayerPicker.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar.tsx';

export default function TemplateEditorSidebar() {
  return (
    <Sidebar side="right" className="top-14 !h-[calc(100svh-56px)]">
      <SidebarContent className="h-full bg-gray-100">
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="relative h-full">
            <div className="flex flex-col gap-3">
              <NewLayerDropdownMenu />
              <CurrentLayerComponent />
            </div>

            <SvgLayerPicker />

            <DeleteCurrentLayerButton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
