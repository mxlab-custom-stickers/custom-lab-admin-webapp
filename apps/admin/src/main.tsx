import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuthContext } from '@/contexts/auth-context.tsx';
import { StrictMode } from 'react';
import './index.css';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree, context: { auth: undefined! } });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthContext();
  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
      <Toaster duration={7000} />
    </StrictMode>
  );
}
