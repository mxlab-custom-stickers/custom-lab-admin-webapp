import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar.tsx';
import EditTemplateLayerColor from './EditTemplateLayerColor';

export default function TemplateEditorSidebar() {
  return (
    <Sidebar side="right">
      <SidebarContent className="bg-gray-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <EditTemplateLayerColor />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
