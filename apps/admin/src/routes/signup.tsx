import SignUpForm from '@/components/auth/SignUpForm';
import { createFileRoute, redirect, useRouter, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

const REDIRECT_FALLBACK = '/';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  // Redirect if user is already authenticated
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
  const search = useSearch({ strict: false });

  function handleSignUpSuccess() {
    router.invalidate().finally(() => {
      // Prevent redirect to external URLs
      const safeRedirect = search.redirect?.startsWith('/') ? search.redirect : REDIRECT_FALLBACK;
      navigate({ to: safeRedirect });
    });
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm onSuccess={handleSignUpSuccess} />
      </div>
    </div>
  );
}
