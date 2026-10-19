import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ReadUser } from "../types/User.ts";
import { setOnUnauthorized } from "../utils/api";

const url = import.meta.env.VITE_URL;

interface AuthContextType {
  user: ReadUser | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ReadUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

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
    setToken(token);
    await fetchUser(token);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    // El redireccionamiento se manejará en los componentes/rutas
  }, []);

  // Un 401 en cualquier request cierra la sesión y descarta los datos cacheados,
  // para que el dashboard no quede mostrando listas de una sesión muerta.
  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      queryClient.clear();
    });
  }, [logout, queryClient]);

  // Verificar token al iniciar la app
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
      fetchUser(stored);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
