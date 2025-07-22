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
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import Submit from '@/components/ui/Submit.tsx';
import { sendPasswordResetEmail } from '@clab/firebase';
import { cn } from '@clab/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResetPasswordDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);
    setError(undefined);

    try {
      await sendPasswordResetEmail(email);
      toast.success('Un email de réinitialisation a été envoyé', {
        position: 'bottom-center',
      });
      handleDialogChange(false);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(
        'Une erreur s’est produite lors de la réinitialisation du mot de passe. Veuillez réessayer plus tard.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setEmail('');
      setError(undefined);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={cn('p-0 text-sm font-normal underline-offset-2 hover:underline', className)}
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
            void handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Mot de passe oublié ?</DialogTitle>
            <DialogDescription>
              Entrez votre adresse email pour réinitialiser votre mot de passe.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="email">Votre adresse email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
            {error ? <div className="text-destructive text-sm">{error}</div> : null}
          </div>

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
