"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { PublicUser } from "@/types";
import { getSupabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function supabaseUserToPublic(supabaseUser: SupabaseUser, profile?: { name: string; role: string; avatar: string; created_at: string } | null): PublicUser {
  return {
    id: supabaseUser.id,
    name: profile?.name || supabaseUser.email || "Usuário",
    email: supabaseUser.email || "",
    role: (profile?.role as "user" | "admin") || "user",
    avatar: profile?.avatar || "U",
    createdAt: profile?.created_at || new Date().toISOString().split("T")[0],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();

    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await sb
          .from("profiles")
          .select("name, role, avatar, created_at")
          .eq("id", session.user.id)
          .single();
        setUser(supabaseUserToPublic(session.user, profile));
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = sb.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await sb
          .from("profiles")
          .select("name, role, avatar, created_at")
          .eq("id", session.user.id)
          .single();
        setUser(supabaseUserToPublic(session.user, profile));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login")) {
        return { success: false, error: "Email ou senha inválidos." };
      }
      return { success: false, error: error.message };
    }
    if (data.user) {
      const { data: profile } = await sb
        .from("profiles")
        .select("name, role, avatar, created_at")
        .eq("id", data.user.id)
        .single();
      setUser(supabaseUserToPublic(data.user, profile));
    }
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "Este email já está cadastrado." };
      }
      return { success: false, error: error.message };
    }
    if (data.user) {
      await new Promise((r) => setTimeout(r, 1500));
      const { data: profile } = await sb
        .from("profiles")
        .select("name, role, avatar, created_at")
        .eq("id", data.user.id)
        .single();
      setUser(supabaseUserToPublic(data.user, profile));
    }
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    const sb = getSupabase();
    await sb.auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const sb = getSupabase();
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      resetPassword,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
