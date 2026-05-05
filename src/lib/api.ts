// Base URL
const API_BASE = import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:8001/api";

// ── session storage ───────────────────────────────────────────────────────────

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
  avatarUrl?: string; // stored locally until backend supports it
}

export function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem("renteasy_session");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSession(res: AuthResponse, avatarUrl?: string) {
  const existing = getStoredSession();
  const session: StoredSession = {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: res.user,
    avatarUrl: avatarUrl ?? existing?.avatarUrl,
  };
  localStorage.setItem("renteasy_session", JSON.stringify(session));
}

export function updateSessionAvatar(avatarUrl: string) {
  const session = getStoredSession();
  if (session) {
    session.avatarUrl = avatarUrl;
    localStorage.setItem("renteasy_session", JSON.stringify(session));
  }
}

export function clearSession() {
  localStorage.removeItem("renteasy_session");
}

export function loadSession(): StoredSession | null {
  return getStoredSession();
}

// ── auth headers ──────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const session = getStoredSession();
  return session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {};
}

// ── generic request ───────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
  return data as T;
}

// ── types ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: "USER" | "OWNER" | "ADMIN" | "TENANT";
  createdAt: string;
}

export interface PropertyDto {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  city: string;
  locality: string;
  price: number;
  priceUnit: string;
  beds: number | null;
  baths: number | null;
  squareFeet: number | null;
  isFeatured: boolean;
  isVerified: boolean;
  images: string[];
  amenities: string[];
  ownerId: string;
  ownerName: string;
  contactNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyRequest {
  title: string;
  description?: string;
  type: PropertyType;
  city: string;
  locality: string;
  price: number;
  priceUnit?: string;
  beds?: number;
  baths?: number;
  squareFeet?: number;
  isFeatured?: boolean;
  isVerified?: boolean;
  images?: string[];
  amenities?: string[];
  contactNumber?: string;
  status?: string;
}

export interface PropertyFilters {
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
}

export type PropertyType = "PG" | "ROOM" | "APARTMENT" | "FLAT" | "VILLA" | "COMMERCIAL";
export type UserRole = "USER" | "OWNER" | "ADMIN" | "TENANT";

// ── Cloudinary image upload ───────────────────────────────────────────────────
// 1. Sign up free at cloudinary.com
// 2. Copy Cloud Name from dashboard
// 3. Settings > Upload > Upload presets > Add preset > set Unsigned
// 4. Add to .env: VITE_CLOUDINARY_CLOUD_NAME=xxx  VITE_CLOUDINARY_UPLOAD_PRESET=xxx

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "rentpeeasy_unsigned";

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD) {
    throw new Error("Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME to your .env file.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", "rentpeeasy");

  const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? "Image upload failed");
  return data.secure_url as string;
}

// ── API methods ───────────────────────────────────────────────────────────────

export const api = {
  async login(username: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber: string;
    role: "USER" | "TENANT" | "OWNER";
  }): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  async logout(): Promise<void> {
    try { await request<void>("/auth/logout", { method: "POST" }); } catch { }
  },

  async getProperties(filters?: PropertyFilters): Promise<PropertyDto[]> {
    const params = new URLSearchParams();
    if (filters?.city) params.set("city", filters.city);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.minPrice != null) params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    const qs = params.toString();
    return request<PropertyDto[]>(`/properties${qs ? `?${qs}` : ""}`);
  },

  async getFeaturedProperties(): Promise<PropertyDto[]> {
    return request<PropertyDto[]>("/properties/featured");
  },

  async getProperty(id: string): Promise<PropertyDto> {
    return request<PropertyDto>(`/properties/${id}`);
  },

  async createProperty(data: PropertyRequest): Promise<PropertyDto> {
    return request<PropertyDto>("/properties", { method: "POST", body: JSON.stringify(data) });
  },

  async updateProperty(id: string, data: PropertyRequest): Promise<PropertyDto> {
    return request<PropertyDto>(`/properties/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },

  async deleteProperty(id: string): Promise<void> {
    return request<void>(`/properties/${id}`, { method: "DELETE" });
  },

  async getFavorites(): Promise<PropertyDto[]> {
    return request<PropertyDto[]>("/favorites");
  },

  async addFavorite(propertyId: string): Promise<void> {
    return request<void>(`/favorites/${propertyId}`, { method: "POST" });
  },

  async removeFavorite(propertyId: string): Promise<void> {
    return request<void>(`/favorites/${propertyId}`, { method: "DELETE" });
  },
};

export async function tryRefreshSession(): Promise<boolean> {
  const session = loadSession();
  if (!session?.refreshToken) return false;
  try {
    const fresh = await api.refreshToken(session.refreshToken);
    saveSession(fresh, session.avatarUrl);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Price on request";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatLocation(p: Pick<PropertyDto, "locality" | "city">): string {
  return [p.locality, p.city].filter(Boolean).join(", ");
}