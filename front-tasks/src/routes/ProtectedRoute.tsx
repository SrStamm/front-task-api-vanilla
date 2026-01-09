import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "black" }}>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
