// Servicio de autenticación para el sistema de login

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  email: string;
  role: string;
}

export interface AuthUser {
  email: string;
  role: string;
  token: string;
}

/**
 * Login del usuario admin
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error en el login" }));
    throw new Error(error.message || "Credenciales inválidas");
  }

  return response.json();
}

/**
 * Guarda el token y datos del usuario en localStorage
 */
export function saveAuth(authData: LoginResponse): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("auth_user", JSON.stringify({
      email: authData.email,
      role: authData.role,
    }));
  }
}

/**
 * Obtiene el token guardado
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

/**
 * Obtiene el usuario guardado
 */
export function getUser(): AuthUser | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { ...user, token };
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Cierra sesión
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  }
}

/**
 * Obtiene los headers de autenticación para las peticiones
 */
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  if (token) {
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
}
