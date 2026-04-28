// Base URL - reads VITE_BACKEND_URL from .env, falls back to localhost
const API_BASE = import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:8001/api";

// ── helpers ───────────────────────────────────────────────────────────────────

function getStoredUser(): StoredSession | null {
  try {
    const raw = localStorage.getItem("renteasy_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const session = getStoredUser();
  return session?.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// ── types matching backend DTOs exactly ───────────────────────────────────────

/** Matches AuthResponse.java */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserDto;
}

/** Matches UserDto.java */
export interface UserDto {
  id: string;           // UUID
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: "USER" | "OWNER" | "ADMIN";
  createdAt: string;
}

/** Matches PropertyDto.java */
export interface PropertyDto {
  id: string;           // UUID
  title: string;
  description: string;
  type: PropertyType;
  city: string;
  locality: string;
  price: number;        // BigDecimal comes as number in JSON
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

/** Matches PropertyRequest.java */
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

/** Matches LoginRequest.java - only username, no email */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Matches RegisterRequest.java */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export type PropertyType = "PG" | "ROOM" | "APARTMENT" | "FLAT" | "VILLA" | "COMMERCIAL";

export interface PropertyFilters {
  city?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
}

// ── stored session (what we persist in localStorage) ─────────────────────────

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export function saveSession(res: AuthResponse) {
  const session: StoredSession = {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    user: res.user,
  };
  localStorage.setItem("renteasy_session", JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem("renteasy_session");
}

export function loadSession(): StoredSession | null {
  return getStoredUser();
}

// ── API methods ───────────────────────────────────────────────────────────────

export const api = {

  // ── auth ──────────────────────────────────────────────────────────────────

  /** POST /api/auth/login  — backend expects { username, password } */
  async login(username: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password } satisfies LoginRequest),
    });
  },

  /** POST /api/auth/register  — backend expects { username, email, password, fullName } */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** POST /api/auth/refresh */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  /** POST /api/auth/logout */
  async logout(): Promise<void> {
    try {
      await request<void>("/auth/logout", { method: "POST" });
    } catch { /* always clear locally */ }
  },

  // ── properties ─────────────────────────────────────────────────────────────

  /** GET /api/properties?city=&type=&minPrice=&maxPrice= */
  async getProperties(filters?: PropertyFilters): Promise<PropertyDto[]> {
    const params = new URLSearchParams();
    if (filters?.city) params.set("city", filters.city);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.minPrice != null) params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    const qs = params.toString();
    return request<PropertyDto[]>(`/properties${qs ? `?${qs}` : ""}`);
  },

  /** GET /api/properties/featured */
  async getFeaturedProperties(): Promise<PropertyDto[]> {
    return request<PropertyDto[]>("/properties/featured");
  },

  /** GET /api/properties/:id */
  async getProperty(id: string): Promise<PropertyDto> {
    return request<PropertyDto>(`/properties/${id}`);
  },

  /** POST /api/properties (auth required) */
  async createProperty(data: PropertyRequest): Promise<PropertyDto> {
    return request<PropertyDto>("/properties", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** PUT /api/properties/:id (owner only) */
  async updateProperty(id: string, data: PropertyRequest): Promise<PropertyDto> {
    return request<PropertyDto>(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /** DELETE /api/properties/:id (owner only) */
  async deleteProperty(id: string): Promise<void> {
    return request<void>(`/properties/${id}`, { method: "DELETE" });
  },

  // ── favorites ──────────────────────────────────────────────────────────────

  /** GET /api/favorites (auth required) */
  async getFavorites(): Promise<PropertyDto[]> {
    return request<PropertyDto[]>("/favorites");
  },

  /** POST /api/favorites/:propertyId (auth required) */
  async addFavorite(propertyId: string): Promise<void> {
    return request<void>(`/favorites/${propertyId}`, { method: "POST" });
  },

  /** DELETE /api/favorites/:propertyId (auth required) */
  async removeFavorite(propertyId: string): Promise<void> {
    return request<void>(`/favorites/${propertyId}`, { method: "DELETE" });
  },
};

// ── silent token refresh on app start ────────────────────────────────────────

export async function tryRefreshSession(): Promise<boolean> {
  const session = loadSession();
  if (!session?.refreshToken) return false;
  try {
    const fresh = await api.refreshToken(session.refreshToken);
    saveSession(fresh);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

// ── display helpers ────────────────────────────────────────────────────────────

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Price on request";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatLocation(p: Pick<PropertyDto, "locality" | "city">): string {
  return [p.locality, p.city].filter(Boolean).join(", ");
}