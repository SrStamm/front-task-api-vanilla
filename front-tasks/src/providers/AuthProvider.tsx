import { createContext, useState, useEffect, ReactNode } from "react";
import type { ReadUser } from "../types/User.ts";

const url = import.meta.env.VITE_URL;

interface AuthContextType {
  user: ReadUser | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ReadUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token al iniciar la app
  useEffect(() => {
    console.log("🔍 AuthProvider - Efecto inicial");
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔑 AuthProvider - Token encontrado en localStorage");
      fetchUser(token);
    } else {
      console.log("🔓 AuthProvider - No hay token");
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    console.log("🔄 AuthProvider - fetchUser ejecutándose");
    try {
      const res = await fetch(url + "user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
          Accept: "application/json",
        },
      });

      console.log("📡 AuthProvider - Status:", res.status);

      if (!res.ok) {
        console.error("❌ AuthProvider - Error en respuesta");
        throw new Error(`Status ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ AuthProvider - Usuario recibido:", data.username);

      const normalizedUser: ReadUser = {
        user_id: data.user_id,
        username: data.username,
      };

      setUser(normalizedUser);
    } catch (err) {
      console.error("⚠️ AuthProvider - Error en fetchUser:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      console.log("🏁 AuthProvider - Finalizando loading");
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    console.log("🔑 AuthProvider - login ejecutándose");
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  const logout = () => {
    console.log("🚪 AuthProvider - logout ejecutándose");
    localStorage.removeItem("token");
    setUser(null);
    // El redireccionamiento se manejará en los componentes/rutas
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
