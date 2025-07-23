import { Card, CardContent } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

import logo from '@/assets/logo_mxlab_blason_black_shadow.png';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.tsx';
import ResetPasswordFormDialog from '@/components/auth/ResetPasswordFormDialog.tsx';
import FieldInfo from '@/components/ui/FieldInfo.tsx';
import { PasswordInput } from '@/components/ui/PasswordInput.tsx';
import Submit from '@/components/ui/Submit.tsx';
import { useLoginForm } from '@/hooks/forms/use-login-form.ts';
import { useStore } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

type LoginFormProps = React.ComponentPropsWithoutRef<'div'> & {
  onSuccess?: () => void;
};

export default function LoginForm({ className, onSuccess, ...props }: LoginFormProps) {
  const { form, loading, error } = useLoginForm(onSuccess);

  // Used to open the reset the password dialog with the current email
  const email = useStore(form.store, (state) => state.values.email);

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
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Connexion</h1>
                <p className="text-muted-foreground text-balance">
                  Accès à votre espace Custom Lab
                </p>
              </div>
              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>Email</Label>
                    <div>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoFocus
                        autoComplete="email"
                        aria-invalid={!field.state.meta.isValid}
                        aria-describedby={`${field.name}-error`}
                        required
                      />
                      <FieldInfo field={field} />
                    </div>
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
                      <ResetPasswordFormDialog defaultEmail={email} />
                    </div>
                    <div>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="current-password"
                        aria-invalid={!field.state.meta.isValid}
                        aria-describedby={`${field.name}-error`}
                        required
                      />
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              </form.Field>
              {/* Submit */}
              <Submit className="w-full" loading={loading}>
                Connexion
              </Submit>
              {/* Error */}
              {error ? <div className="text-destructive text-center text-sm">{error}</div> : null}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Ou</span>
              </div>
              {/* Google */}
              <GoogleSignInButton onSuccess={onSuccess} />
              {/* Sign up link */}
              <div className="text-center text-sm">
                Pas encore inscrit ?{' '}
                <Link
                  to="/signup"
                  search={(prev) => ({ ...prev })}
                  className="underline underline-offset-4"
                >
                  Créer un compte
                </Link>
              </div>
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
