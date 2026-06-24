"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { PublicUser, UserRole } from "@/types";
import { getSupabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDiscord: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isClient: boolean;
  role: UserRole;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function resolveUserRole(sb: ReturnType<typeof getSupabase>, supabaseUser: SupabaseUser): Promise<UserRole> {
  const discordId = supabaseUser.user_metadata?.provider_id || supabaseUser.app_metadata?.provider_id;
  if (discordId) {
    const { data: discordRole } = await sb
      .from("discord_roles")
      .select("role")
      .eq("discord_id", discordId)
      .single();
    if (discordRole) return discordRole.role as UserRole;
  }
  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", supabaseUser.id)
    .single();
  return (profile?.role as UserRole) || "client";
}

function supabaseUserToPublic(
  supabaseUser: SupabaseUser,
  profile?: { name: string; role: string; avatar: string; created_at: string; discord_id?: string; discord_username?: string; discord_avatar?: string } | null
): PublicUser {
  return {
    id: supabaseUser.id,
    name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email || "Usuário",
    email: supabaseUser.email || "",
    role: (profile?.role as UserRole) || "client",
    avatar: profile?.avatar || supabaseUser.user_metadata?.avatar_url || "U",
    createdAt: profile?.created_at || new Date().toISOString().split("T")[0],
    discordId: profile?.discord_id || supabaseUser.user_metadata?.provider_id,
    discordUsername: profile?.discord_username || supabaseUser.user_metadata?.full_name,
    discordAvatar: profile?.discord_avatar || supabaseUser.user_metadata?.avatar_url,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    const sb = getSupabase();
    const role = await resolveUserRole(sb, supabaseUser);
    let { data: profile } = await sb
      .from("profiles")
      .select("name, role, avatar, created_at, discord_id, discord_username, discord_avatar")
      .eq("id", supabaseUser.id)
      .single();

    if (!profile) {
      const displayName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email || "Usuário";
      const avatarUrl = supabaseUser.user_metadata?.avatar_url;
      const initials = avatarUrl ? displayName.charAt(0).toUpperCase() : displayName.slice(0, 2).toUpperCase();

      const { data: newProfile } = await sb
        .from("profiles")
        .insert({
          id: supabaseUser.id,
          name: displayName,
          email: supabaseUser.email || "",
          avatar: initials,
          discord_id: supabaseUser.user_metadata?.provider_id || null,
          discord_username: supabaseUser.user_metadata?.full_name || null,
          discord_avatar: avatarUrl || null,
          role,
        })
        .select("name, role, avatar, created_at, discord_id, discord_username, discord_avatar")
        .single();

      profile = newProfile;
    }

    if (profile && profile.role !== role) {
      await sb.from("profiles").update({ role }).eq("id", supabaseUser.id);
      profile.role = role;
    }

    return supabaseUserToPublic(supabaseUser, profile ? { ...profile, role } : null);
  }, []);

  useEffect(() => {
    const sb = getSupabase();

    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const publicUser = await fetchProfile(session.user);
          setUser(publicUser);
        } catch (err) {
          console.error("Erro ao buscar profile:", err);
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email || "Usuário",
            email: session.user.email || "",
            role: "client",
            avatar: "U",
            createdAt: new Date().toISOString().split("T")[0],
          });
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = sb.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const publicUser = await fetchProfile(session.user);
          setUser(publicUser);
        } catch (err) {
          console.error("Erro ao buscar profile:", err);
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email || "Usuário",
            email: session.user.email || "",
            role: "client",
            avatar: "U",
            createdAt: new Date().toISOString().split("T")[0],
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Erro no login Supabase:", error.message);
      if (error.message.includes("Invalid login")) {
        return { success: false, error: "Email ou senha inválidos." };
      }
      return { success: false, error: error.message };
    }
    if (data.user) {
      try {
        const publicUser = await fetchProfile(data.user);
        setUser(publicUser);
      } catch (err) {
        console.error("Erro ao buscar profile após login:", err);
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email || "Usuário",
          email: data.user.email || "",
          role: "client",
          avatar: "U",
          createdAt: new Date().toISOString().split("T")[0],
        });
      }
    }
    return { success: true };
  }, [fetchProfile]);

  const loginWithDiscord = useCallback(async () => {
    const sb = getSupabase();
    const { error } = await sb.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: "identify email",
      },
    });
    if (error) return { success: false, error: error.message };
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
      const publicUser = await fetchProfile(data.user);
      setUser(publicUser);
    }
    return { success: true };
  }, [fetchProfile]);

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

  const refreshProfile = useCallback(async () => {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) {
      const publicUser = await fetchProfile(session.user);
      setUser(publicUser);
    }
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithDiscord,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isEmployee: user?.role === "employee",
      isClient: user?.role === "client",
      role: user?.role || "client",
      resetPassword,
      refreshProfile,
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
