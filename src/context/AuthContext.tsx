import React, { createContext, useContext, useState, ReactNode } from "react";
import { authService } from "../features/auth/api/auth.service";
import { AuthUser, LoginCredentials, LoginResult } from "./models";
import { LoginResponse } from "../features/auth/api/models";

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
  isAuthenticated: boolean;
}

interface JwtPayload {
  user_id: number;
  roles: string[];
  username: string;
  email: string;
  [key: string]: any;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ==========================================
// Helper Functions
// ==========================================

const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Create Context with null default
const AuthContext = createContext<AuthContextType | null>(null);

// ==========================================
// Auth Provider Component
// ==========================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser =
      localStorage.getItem("sea-user") || sessionStorage.getItem("sea-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  const login = async ({
    username,
    password,
    rememberMe,
  }: LoginCredentials): Promise<LoginResult> => {
    setLoading(true);
    try {
      const data: LoginResponse = await authService.login({
        username,
        password,
      });

      // Handle "Account not verified" special case
      if (data && (!data.is_verified || !data.token)) {
        return {
          success: false,
          status: "verification_needed",
          user_id: data.user_id ?? null,
        };
      }

      const token = data?.token || "";
      const decodedToken = parseJwt(token);

      // Handle Storage Choice
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("sea-token", token);

      // Map user details directly from LoginResponse with fallback to JWT
      const userToSet: AuthUser = {
        user_id: data.user_id ?? decodedToken?.user_id,
        roles: data.roles ?? decodedToken?.roles ?? [],
      };

      setUser(userToSet);
      storage.setItem("sea-user", JSON.stringify(userToSet));
      return { success: true };
    } catch (error: any) {
      const errorData = error.response?.data;
      const serverMessage =
        errorData?.message ||
        errorData?.error ||
        (typeof errorData === "string" ? errorData : "");
      const cleanMessage = String(serverMessage).toLowerCase().trim();

      // Check if the backend sent the verification message via error response
      if (cleanMessage.includes("account not verified")) {
        return {
          success: false,
          status: "verification_needed",
          user_id: errorData?.user_id ?? null,
        };
      }

      const msg =
        error.response?.data?.message || error.message || "Login failed";
      return {
        success: false,
        message: msg,
        user_id: errorData?.user_id ?? null,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("sea-token");
    localStorage.removeItem("sea-user");
    sessionStorage.removeItem("sea-token");
    sessionStorage.removeItem("sea-user");
    setUser(null);
  };

  const hasRole = (...roles: string[]): boolean =>
    user?.roles?.some((r) => roles.includes(r)) ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// Custom Hook
// ==========================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
