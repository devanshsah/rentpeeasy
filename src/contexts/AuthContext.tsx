import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "owner" | "tenant";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: "owner-1",
    email: "owner@renteasy.com",
    name: "Rajesh Verma",
    phone: "+91 98765 43210",
    role: "owner",
    joinedDate: "Jan 2024",
  },
  {
    id: "tenant-1",
    email: "tenant@renteasy.com",
    name: "Ananya Singh",
    phone: "+91 91234 56789",
    role: "tenant",
    joinedDate: "Mar 2024",
  },
];

interface AuthContextType {
  user: DemoUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, phone: string, role: UserRole) => { success: boolean; error?: string };
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

  const login = (email: string, password: string) => {
    // Demo: accept password "demo123" for preset accounts, or any registered user
    const preset = DEMO_USERS.find((u) => u.email === email);
    if (preset && password === "demo123") {
      setUser(preset);
      localStorage.setItem("renteasy_user", JSON.stringify(preset));
      return { success: true };
    }

    // Check locally registered users
    const registeredUsers: DemoUser[] = JSON.parse(localStorage.getItem("renteasy_registered") || "[]");
    const found = registeredUsers.find((u) => u.email === email);
    if (found && password === "demo123") {
      setUser(found);
      localStorage.setItem("renteasy_user", JSON.stringify(found));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password. Use demo123 as password." };
  };

  const register = (name: string, email: string, _password: string, phone: string, role: UserRole) => {
    const allUsers = [...DEMO_USERS, ...JSON.parse(localStorage.getItem("renteasy_registered") || "[]")];
    if (allUsers.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered." };
    }

    const newUser: DemoUser = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      phone,
      role,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };

    const registered = JSON.parse(localStorage.getItem("renteasy_registered") || "[]");
    registered.push(newUser);
    localStorage.setItem("renteasy_registered", JSON.stringify(registered));

    setUser(newUser);
    localStorage.setItem("renteasy_user", JSON.stringify(newUser));
    return { success: true };
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
};
