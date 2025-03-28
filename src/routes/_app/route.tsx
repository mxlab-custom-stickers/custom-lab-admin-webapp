import { AppSidebar } from '@/components/app-sidebar.tsx';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar.tsx';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="p-6 pt-2">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
