import GoogleSignInButton from '@/components/auth/GoogleSignInButton.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import FieldInfo from '@/components/ui/FieldInfo.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { PasswordInput } from '@/components/ui/PasswordInput.tsx';
import Submit from '@/components/ui/Submit.tsx';
import { useSignupForm } from '@/hooks/forms/use-signup-form.ts';
import { cn } from '@clab/utils';
import { Link } from '@tanstack/react-router';
import React from 'react';

type SignUpFormProps = React.ComponentPropsWithoutRef<'div'> & {
  onSuccess?: () => void;
};

export default function SignUpForm({ className, onSuccess, ...props }: SignUpFormProps) {
  const { form, loading, error } = useSignupForm(onSuccess);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Créez votre compte</CardTitle>
          <CardDescription className="text-balance text-base">
            Création de votre espace Custom Lab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="grid gap-6">
              {/* fullName */}
              <form.Field name="fullName">
                {(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>Nom complet</Label>
                    <div>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={!field.state.meta.isValid}
                        aria-describedby={`${field.name}-error`}
                        autoFocus
                        required
                      />
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              </form.Field>
              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>Email</Label>
                    <div>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="m@example.com"
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
                    <Label htmlFor={field.name}>Mot de passe</Label>
                    <div>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="new-password"
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
              <Submit loading={loading}>Créer mon compte</Submit>
              {/* Error */}
              {error ? <div className="text-destructive text-center text-sm">{error}</div> : null}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Ou</span>
              </div>
              {/* Google */}
              <GoogleSignInButton onSuccess={onSuccess} />
              {/* SignIn link */}
              <div className="text-center text-sm">
                Déjà inscrit ?{' '}
                <Link
                  to="/signin"
                  search={(prev) => ({ ...prev })}
                  className="underline underline-offset-4"
                >
                  Connectez-vous
                </Link>
              </div>
            </div>
          </form>
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
