import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";
import LoadingScreen from "../components/common/LoadingScreen";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  // Sin este guard, /login parpadearía antes de redirigir a /dashboard.
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" />;
  return children;
};
