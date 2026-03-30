import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export type UserRole = "owner" | "tenant" | "admin";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
  token?: string;
}

const DEMO_USERS: DemoUser[] = [
  { id: "owner-1", email: "owner@renteasy.com", name: "Rajesh Verma", phone: "+91 98765 43210", role: "owner", joinedDate: "Jan 2024" },
  { id: "tenant-1", email: "tenant@renteasy.com", name: "Ananya Singh", phone: "+91 91234 56789", role: "tenant", joinedDate: "Mar 2024" },
  { id: "admin-1", email: "admin@renteasy.com", name: "Super Admin", phone: "+91 90000 00000", role: "admin", joinedDate: "Jan 2024" },
];

interface AuthContextType {
  user: DemoUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("renteasy_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const saveUser = (u: DemoUser) => {
    setUser(u);
    localStorage.setItem("renteasy_user", JSON.stringify(u));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Try backend API first
    try {
      const data = await api.login(email, password);
      const u: DemoUser = {
        id: data.user?.id || data.id || email,
        email: data.user?.email || email,
        name: data.user?.name || email.split("@")[0],
        phone: data.user?.phone || "",
        role: data.user?.role || "tenant",
        joinedDate: data.user?.joinedDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        token: data.token,
      };
      saveUser(u);
      return { success: true };
    } catch {
      // Fallback to demo mode
      const preset = DEMO_USERS.find((u) => u.email === email);
      if (preset && password === "demo123") {
        saveUser(preset);
        return { success: true };
      }
      const registeredUsers: DemoUser[] = JSON.parse(localStorage.getItem("renteasy_registered") || "[]");
      const found = registeredUsers.find((u) => u.email === email);
      if (found && password === "demo123") {
        saveUser(found);
        return { success: true };
      }
      return { success: false, error: "Invalid email or password. Use demo123 as password for demo accounts." };
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    // Try backend API first
    try {
      const data = await api.register(name, email, password, phone, role);
      const u: DemoUser = {
        id: data.user?.id || `${role}-${Date.now()}`,
        email: data.user?.email || email,
        name: data.user?.name || name,
        phone: data.user?.phone || phone,
        role: (data.user?.role as UserRole) || role,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        token: data.token,
      };
      saveUser(u);
      return { success: true };
    } catch {
      // Fallback to demo/local mode
      const allUsers = [...DEMO_USERS, ...JSON.parse(localStorage.getItem("renteasy_registered") || "[]")];
      if (allUsers.find((u) => u.email === email)) {
        return { success: false, error: "Email already registered." };
      }
      const newUser: DemoUser = {
        id: `${role}-${Date.now()}`,
        email, name, phone, role,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      };
      const registered = JSON.parse(localStorage.getItem("renteasy_registered") || "[]");
      registered.push(newUser);
      localStorage.setItem("renteasy_registered", JSON.stringify(registered));
      saveUser(newUser);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("renteasy_user");
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

// Demo credentials for investor presentation
export const DEMO_CREDENTIALS = {
  owner: { email: "owner@renteasy.com", password: "demo123" },
  tenant: { email: "tenant@renteasy.com", password: "demo123" },
  admin: { email: "admin@renteasy.com", password: "demo123" },
};
