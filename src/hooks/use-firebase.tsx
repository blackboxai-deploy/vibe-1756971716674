
"use client";

import * as React from "react";
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, Auth, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = React.createContext<FirebaseContextType | undefined>(
  undefined
);

export function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [app, setApp] = React.useState<FirebaseApp | null>(null);
  const [auth, setAuth] = React.useState<Auth | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const initialize = async () => {
      try {
        if (!firebaseConfig.apiKey) {
            console.error("Firebase config is missing. Make sure .env file is set up correctly.");
            setLoading(false);
            return;
        }
        const appInstance = !getApps().length
          ? initializeApp(firebaseConfig)
          : getApp();
        setApp(appInstance);
        const authInstance = getAuth(appInstance);
        setAuth(authInstance);

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setUser(user);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setLoading(false);
      }
    };
    initialize();
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, auth, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}
