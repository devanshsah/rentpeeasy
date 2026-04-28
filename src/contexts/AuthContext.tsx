import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  api,
  loadSession,
  saveSession,
  clearSession,
  tryRefreshSession,
  type UserDto,
  type StoredSession,
} from "@/lib/api";

// ── types ─────────────────────────────────────────────────────────────────────

/** Role strings as they come from backend (uppercase) */
export type UserRole = "USER" | "OWNER" | "ADMIN";

/** The shape components use — comes directly from UserDto */
export type AppUser = UserDto & {
  token: string;
};

interface AuthContextType {
  user: AppUser | null;
  login: (
      username: string,
      password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
      username: string,
      email: string,
      password: string,
      fullName: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function sessionToUser(session: StoredSession): AppUser {
  return { ...session.user, token: session.accessToken };
}

// ── context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const session = loadSession();
    return session ? sessionToUser(session) : null;
  });

  // On mount: silently try to refresh so session survives page reload
  useEffect(() => {
    tryRefreshSession().then((ok) => {
      if (ok) {
        const session = loadSession();
        if (session) setUser(sessionToUser(session));
      }
    });
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (
      username: string,
      password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.login(username, password);
      saveSession(res);
      setUser(sessionToUser({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Login failed. Please try again.",
      };
    }
  };

  // ── register ───────────────────────────────────────────────────────────────
  const register = async (
      username: string,
      email: string,
      password: string,
      fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.register({ username, email, password, fullName });
      saveSession(res);
      setUser(sessionToUser({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Registration failed. Please try again.",
      };
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    await api.logout();
    clearSession();
    setUser(null);
  };

  return (
      <AuthContext.Provider
          value={{ user, login, register, logout, isAuthenticated: !!user }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};