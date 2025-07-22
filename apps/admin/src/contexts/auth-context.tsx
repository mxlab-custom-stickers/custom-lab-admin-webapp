import type { AuthContextType } from '@/contexts/auth-types.ts';
import { listenToAuthChanges } from '@clab/firebase';
import { type User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = listenToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Chargement...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
