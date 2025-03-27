import { AppSidebar } from '@/components/app-sidebar.tsx';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
