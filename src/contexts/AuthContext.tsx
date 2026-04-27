import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, tryRefreshSession, type BackendUser } from "@/lib/api";

export type UserRole = "owner" | "tenant" | "admin" | "user";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  token: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

function normaliseRole(raw?: string): UserRole {
  const r = (raw ?? "").toLowerCase();
  if (r === "owner" || r === "landlord") return "owner";
  if (r === "admin") return "admin";
  return "tenant";
}

function buildAppUser(data: Awaited<ReturnType<typeof api.login>>, fallbackEmail: string): AppUser {
  const token = data.accessToken ?? data.token ?? "";
  const refreshToken = data.refreshToken;
  const u: BackendUser | undefined = data.user ?? (data as unknown as BackendUser);
  return {
    id: String(u?.id ?? fallbackEmail),
    email: u?.email ?? fallbackEmail,
    name: u?.fullName ?? u?.name ?? fallbackEmail.split("@")[0],
    phone: u?.phoneNumber ?? u?.phone ?? "",
    role: normaliseRole(u?.role),
    token,
    refreshToken,
  };
}

const STORAGE_KEY = "renteasy_user";

function loadStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

function persistUser(u: AppUser | null) {
  if (u) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(loadStoredUser);

  useEffect(() => {
    tryRefreshSession().catch(() => { });
  }, []);

  const saveUser = (u: AppUser) => {
    setUser(u);
    persistUser(u);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await api.login(email, password);
      saveUser(buildAppUser(data, email));
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      const data = await api.register(name, email, password, phone, role);
      saveUser(buildAppUser(data, email));
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    persistUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};