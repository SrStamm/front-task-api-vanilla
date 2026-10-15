import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  // Obligatorio: sin user todavía, !user redirigiría a /login con el token
  // de sesión aún en restauración.
  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
