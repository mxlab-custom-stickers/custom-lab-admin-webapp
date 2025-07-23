import { logError } from '@/utils/log-error.ts';
import { sendPasswordResetEmail } from '@clab/firebase';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordFormSchema = z.object({
  email: z.email('Adresse email invalide'),
});

export function useResetPasswordForm({
  defaultEmail = '',
  onSuccess,
}: {
  defaultEmail?: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
    },
    validators: {
      onSubmit: resetPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(undefined);

      const { email } = value;

      try {
        await sendPasswordResetEmail(email);
        toast.success('Un email de réinitialisation a été envoyé');
        onSuccess?.();
      } catch (err) {
        logError(err, { context: 'ResetPasswordForm', extra: { email } });
        setError(
          'Une erreur s’est produite lors de la réinitialisation du mot de passe. Veuillez réessayer plus tard.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return { form, loading, error };
}
