import { LoginForm } from '@/components/auth/login-form.tsx';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { z } from 'zod';

const REDIRECT_FALLBACK = '/';

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.user) {
      throw redirect({
        to: '/',
        search: { redirect: search.redirect || REDIRECT_FALLBACK },
      });
    }
  },
});

function RouteComponent() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  async function handleLoginSuccess() {
    await router.invalidate();
    await navigate({ to: search.redirect || REDIRECT_FALLBACK });
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:!max-w-3xl">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
