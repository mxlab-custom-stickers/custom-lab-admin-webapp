import { handleAuthError } from '@/utils/firebase-errors.ts';
import { logError } from '@/utils/log-error.ts';
import { sendEmailVerification, signInWithEmailAndPassword } from '@clab/firebase';
import { useForm } from '@tanstack/react-form';
import type { User } from 'firebase/auth';
import { useState } from 'react';

export function useLoginForm(onSuccess?: (user: User) => void) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      if (loading) return;

      setLoading(true);
      setError(undefined);
      const { email, password } = value;

      let user: User | undefined;

      try {
        user = await signInWithEmailAndPassword(email, password);
      } catch (err) {
        logError(err, { context: 'LoginForm', extra: { email } });
        setError(handleAuthError(err));
      } finally {
        setLoading(false);
      }

      if (!user) return;

      if (!user.emailVerified) {
        // Don't break the login process if the email fails to send
        try {
          await sendEmailVerification();
        } catch (err) {
          logError(err, { context: 'LoginForm', extra: { email } });
        }
      }

      onSuccess?.(user);
    },
  });

  return { form, loading, error };
}
