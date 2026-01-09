import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Status de /user/me:", res.status);
      console.log("Headers:", [...res.headers.entries()]);

      if (!res.ok) {
        const text = await res.text();
        console.error("Error response de /user/me:", text);
        throw new Error(
          `Token inválido - ${res.status}: ${text.slice(0, 200)}`,
        );
      }

      const data = await res.json();
      console.log("Usuario recibido:", data);
      setUser(data);
    } catch (err) {
      localStorage.removeItem("token");
      console.error("Catch en fetchUser:", err);
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
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
