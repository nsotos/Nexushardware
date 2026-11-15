"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, verificamos si hay sesión guardada en localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("nexus_token");
      const storedUser = localStorage.getItem("nexus_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignorar errores de parsing o storage en SSR
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Inicia sesión contra la API de Express
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Error al iniciar sesión",
        };
      }

      // Guardamos la sesión
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("nexus_token", data.token);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));

      return { success: true };
    } catch {
      return {
        success: false,
        message: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 4000.",
      };
    }
  };

  /**
   * Registra un nuevo usuario en la API de Express
   */
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        let msg = data.message || "Error al registrarse";
        if (data.errors && data.errors.length > 0) {
          msg = data.errors.map((e: { message: string }) => e.message).join(", ");
        }
        return { success: false, message: msg };
      }

      // Al registrarse, se inicia sesión automáticamente
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("nexus_token", data.token);
      localStorage.setItem("nexus_user", JSON.stringify(data.user));

      return { success: true };
    } catch {
      return {
        success: false,
        message: "No se pudo conectar con el servidor de autenticación.",
      };
    }
  };

  /**
   * Cierra la sesión activa
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
