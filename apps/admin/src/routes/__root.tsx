import type { AuthContextType } from '@/contexts/auth-types.ts';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
});
