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
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(url + "user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("❌ AuthProvider - Error en respuesta");
        throw new Error(`Status ${res.status}`);
      }

      const data = await res.json();

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
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  const logout = () => {
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
