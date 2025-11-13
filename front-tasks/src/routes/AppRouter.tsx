// Definition for public and private routes

import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { AuthProvider } from "../providers/AuthProvider";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./ProtectedRoute";
import "../App.css";
import { dashboardRoutes } from "./dashboard.routes";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthProvider>
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <PrivateRoute> {dashboardRoutes.element}</PrivateRoute>
      </AuthProvider>
    ),
    children: dashboardRoutes.children,
  },
]);
