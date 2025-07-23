import { handleAuthError } from '@/utils/firebase-errors.ts';
import { logError } from '@/utils/log-error.ts';
import { signInWithEmailAndPassword } from '@clab/firebase';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import z from 'zod';

const loginSchema = z.object({
  email: z.email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export function useLoginForm(onSuccess?: () => void) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(undefined);

      const { email, password } = value;

      try {
        await signInWithEmailAndPassword(email, password);
        onSuccess?.();
      } catch (err) {
        logError(err, { context: 'LoginForm', extra: { email } });
        setError(handleAuthError(err));
        form.setFieldValue('password', '');
      } finally {
        setLoading(false);
      }
    },
  });

  return { form, loading, error };
}
