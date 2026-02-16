import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Helper to fetch profile data from the profiles table
  const fetchProfile = async (userId, email) => {
    try {
      const { data, error } = await supabase
        .from("profiles") // Match your DB table name
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Profile not found for ID:", userId);
        return null;
      }

      // Map DB 'full_name' to 'name' for app-wide consistency
      return {
        ...data,
        name: data.full_name,
        email: email 
      };
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (data?.session?.user) {
          const profile = await fetchProfile(data.session.user.id, data.session.user.email);
          if (profile) {
            if (!cancelled) setUser(profile);
          } else {
            await supabase.auth.signOut();
            if (!cancelled) setUser(null);
          }
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          if (profile) {
            setUser(profile);
          } else if (event !== 'SIGNED_OUT') {
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signup = async ({ email, password, name, phone }) => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (data?.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: name, // Match your DB column 'full_name'
              phone: phone,
              role: "user",
            },
          ]);

        if (profileError) throw profileError;
        return data.user;
      }
    } catch (error) {
      alert(error.message);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const profile = await fetchProfile(data.user.id, data.user.email);
      if (!profile) {
        alert("Account profile missing in database.");
        await logout();
        return null;
      }

      setUser(profile);
      return data.user;
    } catch (error) {
      alert(error.message);
      return null;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading: !ready,
        isAdmin: user?.role === "admin" || user?.role === "staff",
      }}
    >
      {ready ? children : null}
    </AuthContext.Provider>
  );
}