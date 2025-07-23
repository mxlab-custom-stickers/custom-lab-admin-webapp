import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import FieldInfo from '@/components/ui/FieldInfo.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import Submit from '@/components/ui/Submit.tsx';
import { useResetPasswordForm } from '@/hooks/forms/use-reset-password-form.ts';
import { cn } from '@clab/utils';
import { useState } from 'react';

type ResetPasswordFormDialogProps = {
  className?: string;
  defaultEmail?: string;
};

export default function ResetPasswordFormDialog({
  className,
  defaultEmail,
}: ResetPasswordFormDialogProps) {
  const { form, loading, error } = useResetPasswordForm({
    defaultEmail,
    onSuccess: () => setOpen(false),
  });

  const [open, _setOpen] = useState<boolean>(false);

  function setOpen(open: boolean) {
    _setOpen(open);
    if (!open) {
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={cn(
            'h-3.5 p-0 text-sm font-normal underline-offset-2 hover:underline',
            className
          )}
        >
          Mot de passe oublié ?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Mot de passe oublié ?</DialogTitle>
            <DialogDescription>
              Entrez votre adresse email pour réinitialiser votre mot de passe.
            </DialogDescription>
          </DialogHeader>
          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div className="grid gap-3">
                <Label htmlFor={field.name}>Votre adresse email</Label>
                <div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoFocus
                    placeholder="m@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={!field.state.meta.isValid}
                    aria-describedby={`${field.name}-error`}
                    autoComplete="email"
                    required
                  />
                  <FieldInfo field={field} />
                </div>
              </div>
            )}
          </form.Field>
          {/* Error */}
          {error ? <div className="text-destructive text-sm">{error}</div> : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Submit loading={loading}>Valider</Submit>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
