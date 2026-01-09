import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  console.log("🔍 PrivateRoute - user:", user, "loading:", loading);

  if (loading) {
    console.log("⏳ PrivateRoute - Cargando...");
    return <p>Cargando...</p>;
  }

  if (!user) {
    console.log("❌ PrivateRoute - No hay usuario, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ PrivateRoute - Usuario autenticado, mostrando contenido");
  return <>{children}</>;
};
