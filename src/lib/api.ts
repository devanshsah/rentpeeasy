const API_BASE = import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:8001/api";

function authHeader(): Record<string, string> {
  const stored = localStorage.getItem("renteasy_user");
  if (!stored) return {};
  try {
    const user = JSON.parse(stored);
    if (user?.token) return { Authorization: `Bearer ${user.token}` };
  } catch { }
  return {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data as T;
}

export interface BackendUser {
  id: string | number;
  username?: string;
  fullName?: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  role: string;
}

export interface AuthResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: BackendUser;
  id?: string | number;
  email?: string;
  role?: string;
}

export interface Property {
  id: number | string;
  title: string;
  description?: string;
  type: string;
  city?: string;
  locality?: string;
  price: number;
  beds?: number;
  baths?: number;
  squareFeet?: number;
  contactNumber?: string;
  images?: string[];
  amenities?: string[];
  featured?: boolean;
  verified?: boolean;
  ownerId?: number | string;
  createdAt?: string;
}

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const api = {
  async login(emailOrUsername: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: emailOrUsername, email: emailOrUsername, password }),
    });
  },

  async register(fullName: string, email: string, password: string, phoneNumber: string, role: string): Promise<AuthResponse> {
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, fullName, email, password, phoneNumber, role: role.toUpperCase() }),
    });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  async logout(): Promise<void> {
    try {
      await request<void>("/auth/logout", { method: "POST" });
    } catch { }
  },

  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters?.city) params.set("city", filters.city);
    if (filters?.type) params.set("type", filters.type.toUpperCase());
    if (filters?.minPrice != null) params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    const qs = params.toString();
    return request<Property[]>(`/properties${qs ? `?${qs}` : ""}`);
  },

  async getFeaturedProperties(): Promise<Property[]> {
    return request<Property[]>("/properties/featured");
  },

  async getProperty(id: string | number): Promise<Property> {
    return request<Property>(`/properties/${id}`);
  },

  async createProperty(data: Omit<Property, "id">): Promise<Property> {
    return request<Property>("/properties", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProperty(id: string | number, data: Partial<Property>): Promise<Property> {
    return request<Property>(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteProperty(id: string | number): Promise<void> {
    return request<void>(`/properties/${id}`, { method: "DELETE" });
  },

  async getFavorites(): Promise<Property[]> {
    return request<Property[]>("/favorites");
  },

  async addFavorite(propertyId: string | number): Promise<void> {
    return request<void>(`/favorites/${propertyId}`, { method: "POST" });
  },

  async removeFavorite(propertyId: string | number): Promise<void> {
    return request<void>(`/favorites/${propertyId}`, { method: "DELETE" });
  },
};

export async function tryRefreshSession(): Promise<string | null> {
  const stored = localStorage.getItem("renteasy_user");
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    if (!user?.refreshToken) return null;
    const data = await api.refreshToken(user.refreshToken);
    const newToken = data.accessToken || data.token || null;
    if (newToken) {
      user.token = newToken;
      localStorage.setItem("renteasy_user", JSON.stringify(user));
    }
    return newToken;
  } catch {
    return null;
  }
}