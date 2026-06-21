"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { PublicUser } from "@/types";
import { store } from "@/data/store";

interface AuthContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser(): PublicUser | null {
  if (typeof window === "undefined") return null;
  store.init();
  return store.getCurrentUser();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(getInitialUser);

  const login = useCallback(async (email: string, password: string) => {
    const result = await store.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await store.register(name, email, password);
    if (result.success) {
      const current = store.getCurrentUser();
      setUser(current);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    store.logout();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return store.resetPassword(email);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === "admin", resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
