import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import * as gamesApi from "../api/games";

const AuthContext = createContext(null);

const LS_KEY = "gameLibUser"; // { userId, username }

function loadUserFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUserToLS(u) {
  try {
    if (!u) localStorage.removeItem(LS_KEY);
    else localStorage.setItem(LS_KEY, JSON.stringify(u));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUserFromLS());
  const [loading, setLoading] = useState(true);

  // Session restore: try a protected call to see if cookie token is valid.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await gamesApi.getMyCollection();
        // cookie valid, keep LS user if exists
      } catch {
        // cookie invalid or not set => logged out
        saveUserToLS(null);
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      async register(username, password) {
        const data = await authApi.register(username, password);
        const u = { userId: data.userId, username: data.username };
        saveUserToLS(u);
        setUser(u);
      },
      async login(username, password) {
        const data = await authApi.login(username, password);
        const u = { userId: data.userId, username: data.username };
        saveUserToLS(u);
        setUser(u);
      },
      async logout() {
        await authApi.logout();
        saveUserToLS(null);
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
