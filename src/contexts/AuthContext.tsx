import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  api, loadSession, saveSession, clearSession, tryRefreshSession,
  updateSessionAvatar, type UserDto, type StoredSession,
} from "@/lib/api";

export type UserRole = "USER" | "OWNER" | "ADMIN" | "TENANT";

export type AppUser = UserDto & {
  token: string;
  avatarUrl?: string;
};

interface AuthContextType {
  user: AppUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber: string;
    role: "USER" | "TENANT" | "OWNER";
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAvatar: (url: string) => void;
  isAuthenticated: boolean;
}

function sessionToUser(session: StoredSession): AppUser {
  return { ...session.user, token: session.accessToken, avatarUrl: session.avatarUrl };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const session = loadSession();
    return session ? sessionToUser(session) : null;
  });

  useEffect(() => {
    tryRefreshSession().then((ok) => {
      if (ok) {
        const session = loadSession();
        if (session) setUser(sessionToUser(session));
      }
    });
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.login(username, password);
      const existing = loadSession();
      saveSession(res, existing?.avatarUrl);
      setUser(sessionToUser({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user, avatarUrl: existing?.avatarUrl }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Login failed." };
    }
  };

  const register = async (data: Parameters<typeof api.register>[0]) => {
    try {
      const res = await api.register(data);
      saveSession(res);
      setUser(sessionToUser({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Registration failed." };
    }
  };

  const logout = async () => {
    await api.logout();
    clearSession();
    setUser(null);
  };

  const updateAvatar = (url: string) => {
    updateSessionAvatar(url);
    setUser((prev) => prev ? { ...prev, avatarUrl: url } : prev);
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout, updateAvatar, isAuthenticated: !!user }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};