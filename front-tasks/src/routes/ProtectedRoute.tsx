import { useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  return children;
};
