import { AppSidebar } from '@/components/app-sidebar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppProvider } from '@/contexts/app-context.tsx';
import { useAuthContext } from '@/contexts/auth-context.tsx';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/signin',
        search: { redirect: location.href },
      });
    }
  },
});

function AppLayoutComponent() {
  const { user } = useAuthContext();

  return (
    <AppProvider user={user!}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
