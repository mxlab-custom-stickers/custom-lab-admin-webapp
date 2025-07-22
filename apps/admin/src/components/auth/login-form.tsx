import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

import logo from '@/assets/logo_mxlab_blason_black_shadow.png';
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog.tsx';
import Submit from '@/components/ui/Submit.tsx';
import { useLoginForm } from '@/hooks/forms/use-login-form.ts';
import { signInWithGoogle } from '@clab/firebase';
import type { User } from 'firebase/auth';

type LoginFormProps = React.ComponentPropsWithoutRef<'div'> & {
  onSuccess?: (user: User) => void;
};

export function LoginForm({ className, onSuccess, ...props }: LoginFormProps) {
  const { form, loading, error } = useLoginForm(onSuccess);

  async function handleSignInWithGoogle() {
    const user = await signInWithGoogle();
    if (user) onSuccess?.(user);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte Custom Lab
                </p>
              </div>

              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="m@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </form.Field>
              {/* Password */}
              <form.Field name="password">
                {(field) => (
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor={field.name} className="flex-1">
                        Mot de passe
                      </Label>
                      <ResetPasswordDialog />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </form.Field>

              {error ? <p className="text-destructive text-center text-sm">{error}</p> : null}

              {/* Submit */}
              <Submit className="w-full" loading={loading}>
                Connexion
              </Submit>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Ou continuer avec
                </span>
              </div>
              {/* Google */}
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleSignInWithGoogle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-normal">Connexion avec Google</span>
              </Button>

              {/* Sign up link */}
              {/*<div className="text-center text-sm">*/}
              {/*  Don&apos;t have an account?{' '}*/}
              {/*  <a href="#" className="underline underline-offset-4">*/}
              {/*    Sign up*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
          </form>

          {/* MXlab logo */}
          <div className="bg-muted relative hidden md:block">
            <img
              src={logo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs">
        Powered by{' '}
        <a href="https://mxlab.fr" target="_blank">
          MXlab
        </a>
        .
      </div>
    </div>
  );
}
