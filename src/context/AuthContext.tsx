// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile // <-- Add this import
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  role: 'student' | 'teacher';
  firstName: string;
  lastName: string;
  createdAt: Date;
  teacherId?: string; // For students - links them to their teacher
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile({ uid: user.uid, ...userDoc.data() } as UserProfile);
          // If user is on login/signup page, redirect to dashboard
          if (typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
            window.location.href = '/demodashboard/studentdash/real';
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
        // If not logged in and on a protected page, redirect to login
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/demodashboard/studentdash/real')) {
          window.location.href = '/login';
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Signed in user:', result.user);
    // Redirect immediately after successful login
    if (typeof window !== 'undefined') {
      window.location.href = '/demodashboard/studentdash/real';
    }
    // User profile will be loaded by the auth state listener
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Optionally set displayName in Firebase Auth
    if (userData.firstName || userData.lastName) {
      try {
        await updateProfile(result.user, {
          displayName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        });
      } catch (e) {
        console.error("Error updating Firebase displayName:", e);
      }
    }

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      role: userData.role || 'student',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      createdAt: new Date(),
      ...(userData.teacherId && { teacherId: userData.teacherId })
    };

    try {
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      setUserProfile(userProfile);
    } catch (e) {
      console.error("Error writing user profile to Firestore:", e);
      throw e;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};