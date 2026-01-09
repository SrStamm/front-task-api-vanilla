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

  useEffect(() => {
    if (user !== null && !loading) {
      console.log("Usuario cargado → redirigiendo a /dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(url + "user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420", // evita bloqueos raros de ngrok
          Accept: "application/json", // fuerza que espere JSON
        },
      });

      console.log("GET /user/me - Status:", res.status);
      console.log("Content-Type:", res.headers.get("Content-Type"));

      if (!res.ok) {
        const text = await res.text();
        console.error("Error response (text):", text);
        throw new Error(`Status ${res.status}: ${text.slice(0, 200)}`);
      }

      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Respuesta NO es JSON:", text);
        throw new Error("Backend devolvió texto/HTML en vez de JSON");
      }

      const data = await res.json();
      console.log("Usuario recibido (raw):", data);

      // Normaliza el objeto para que coincida con tu tipo ReadUser
      const normalizedUser: ReadUser = {
        user_id: data.user_id,
        username: data.username,
        // agrega más campos si existen
      };

      setUser(normalizedUser);
    } catch (err) {
      console.error("Error completo en fetchUser:", err);
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
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
