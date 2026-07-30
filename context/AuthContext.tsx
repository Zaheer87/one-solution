'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { account, ID } from '@/lib/appwrite/config';
import { getUserProfile, saveUserProfile } from '@/lib/appwrite/services/users';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupUser: (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    phone?: string,
    address?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch full user profile from Appwrite Database
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    return await getUserProfile(uid);
  };

  // Expose a way for pages to re-fetch the current user
  const refreshUser = async () => {
    try {
      const sessionUser = await account.get();
      if (sessionUser) {
        const profile = await fetchUserProfile(sessionUser.$id);
        if (profile) setUser(profile);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to refresh user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await account.get();
        if (sessionUser) {
          const profile = await fetchUserProfile(sessionUser.$id);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (error) {
        // Appwrite throws an error if no session exists
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Ignore error if no session exists
    }
    await account.createEmailPasswordSession(email, pass);
    const sessionUser = await account.get();
    const profile = await fetchUserProfile(sessionUser.$id);
    if (profile) {
      setUser(profile);
    } else {
      throw new Error('Account exists but user profile not found. Please contact support.');
    }
  };

  const signupUser = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    phone?: string,
    address?: string
  ) => {
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Ignore error if no session exists
    }
    const creds = await account.create(ID.unique(), email, pass, name);
    await account.createEmailPasswordSession(email, pass);
    
    const newProfile: UserProfile = {
      $id: creds.$id,
      email,
      name,
      role,
      phone,
      address,
      $createdAt: new Date().toISOString(),
    };
    
    await saveUserProfile(newProfile);
    setUser(newProfile);
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (e) {
      console.error('[logout]', e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        signupUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
