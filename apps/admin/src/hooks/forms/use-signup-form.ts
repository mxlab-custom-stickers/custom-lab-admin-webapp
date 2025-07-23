import { handleAuthError } from '@/utils/firebase-errors.ts';
import { logError } from '@/utils/log-error.ts';
import { sendEmailVerification, signUpWithEmailAndPassword } from '@clab/firebase';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import zxcvbn from 'zxcvbn';

const signUpSchema = z.object({
  fullName: z.string().min(1, 'Le nom est requis'),
  email: z.email('Adresse email invalide'),
  password: z.string().refine((val) => zxcvbn(val).score >= 3, 'Le mot de passe est trop faible'),
});

export function useSignupForm(onSuccess?: () => void) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(undefined);

      const { fullName, email, password } = value;

      // Create user with email and password
      try {
        await signUpWithEmailAndPassword(email, password, fullName);
        // TODO: Track signup event
        // track('Signup', { email });
      } catch (err) {
        logError(err, { context: 'SignupForm', extra: { email } });
        setError(handleAuthError(err));
        setLoading(false);
        return;
      }

      // Send email verification
      try {
        await sendEmailVerification();
      } catch (err) {
        // Don't show error if sending email verification fails
        logError(err, { context: 'SignupForm', extra: { email } });
      } finally {
        setLoading(false);
        onSuccess?.();
      }
    },
  });

  return { form, loading, error };
}
