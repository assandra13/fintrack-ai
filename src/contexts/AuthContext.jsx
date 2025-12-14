import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage mode
      const storedUser = localStorage.getItem("fintrack-user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Merge user_metadata into user object for easier access
        const enrichedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          ...session.user.user_metadata
        };
        setUser(enrichedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Merge user_metadata into user object for easier access
        const enrichedUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          ...session.user.user_metadata
        };
        setUser(enrichedUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async ({ name, email, password }) => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem("fintrack-users") || "[]");

      if (users.find((u) => u.email === email)) {
        return { user: null, error: "Email sudah terdaftar" };
      }

      const newUser = {
        id: "user-" + Date.now(),
        name,
        email,
        password,
        currency: "IDR",
        locale: "id-ID",
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("fintrack-users", JSON.stringify(users));

      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        currency: newUser.currency,
        locale: newUser.locale,
        avatar: newUser.avatar,
      };

      localStorage.setItem("fintrack-user", JSON.stringify(userData));
      setUser(userData);
      return { user: userData, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error("Register error:", error);
      return { user: null, error: error.message };
    }
  };

  const login = async ({ email, password }) => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem("fintrack-users") || "[]");
      const foundUser = users.find((u) => u.email === email && u.password === password);

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          currency: foundUser.currency || "IDR",
          locale: foundUser.locale || "id-ID",
          avatar: foundUser.avatar || null,
        };
        setUser(userData);
        localStorage.setItem("fintrack-user", JSON.stringify(userData));
        return { user: userData, error: null };
      }
      return { user: null, error: "Email atau password salah" };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Merge user_metadata for easier access
      const enrichedUser = {
        ...data.user,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        ...data.user.user_metadata
      };

      return { user: enrichedUser, error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { user: null, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      // Fallback demo
      const userData = {
        id: "google-" + Date.now(),
        name: "Demo User",
        email: "demo@fintrack.ai",
        currency: "IDR",
        locale: "id-ID",
        avatar: null,
      };
      setUser(userData);
      localStorage.setItem("fintrack-user", JSON.stringify(userData));
      return { user: userData, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error("Google login error:", error);
      return { user: null, error: error.message };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage - clear ALL user data
      // Clear all fintrack-related keys from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fintrack-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);

      // Clear all fintrack-related keys from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fintrack-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates) => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      console.log("Updating profile in localStorage mode...");
      console.log("Current user:", user);
      console.log("Updates:", updates);

      const updatedUser = { ...user, ...updates };
      console.log("Updated user object:", updatedUser);

      localStorage.setItem("fintrack-user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Update in users list
      const users = JSON.parse(localStorage.getItem("fintrack-users") || "[]");
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem("fintrack-users", JSON.stringify(users));
        console.log("✅ User updated in fintrack-users list");
      }
      console.log("✅ Profile update completed");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      // Update local user state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Also persist to localStorage so UI remains consistent after refresh
      try {
        localStorage.setItem("fintrack-user", JSON.stringify(updatedUser));
        const users = JSON.parse(localStorage.getItem("fintrack-users") || "[]");
        const index = users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...updates };
          localStorage.setItem("fintrack-users", JSON.stringify(users));
        }
      } catch (e) {
        // ignore localStorage errors
        console.warn("Could not persist updated user to localStorage", e);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured()) {
      return { error: "Password reset not available in offline mode" };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
