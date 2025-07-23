type FirebaseError = {
  code: string;
  message: string;
};

export function handleAuthError(err: unknown): string {
  const code = getFirebaseErrorCode(err);

  const DEFAULT_ERROR_MESSAGE = 'Une erreur est survenue. Veuillez réessayer.';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée.';
    case 'auth/user-not-found':
      return DEFAULT_ERROR_MESSAGE;
    case 'auth/invalid-credential':
      return 'Identifiants incorrects.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.';
    case 'auth/network-request-failed':
      return 'Problème de connexion. Vérifiez votre réseau.';
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    default:
      return DEFAULT_ERROR_MESSAGE;
  }
}

function getFirebaseErrorCode(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    return (err as FirebaseError).code;
  }
  return 'unknown';
}
