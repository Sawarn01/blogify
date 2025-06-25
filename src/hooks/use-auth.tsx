'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import type { User as AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setAppUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setAppUser(snapshot.data() as AppUser);
          setLoading(false);
        } else {
          // User is authenticated, but no document exists. Let's create it.
          const newUser: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            subscription: {
              plan: 'Free',
              status: 'active',
              generationsUsed: 0,
              generationsLimit: 3,
              lifetimeGenerations: 0,
            },
          };
          setDoc(userDocRef, newUser).finally(() => {
            // After creating, the snapshot listener will fire again with the new data.
            // We can set loading to false here, but it will be set on the re-fire anyway.
            // If we don't set it, the loader will show until the doc is confirmed created.
          });
        }
      }, (error) => {
        console.error("Error with user document snapshot:", error);
        setAppUser(null);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
