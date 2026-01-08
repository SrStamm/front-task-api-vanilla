// Definition for public and private routes

import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { AuthProvider } from "../providers/AuthProvider";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./ProtectedRoute";
import "../App.css";
import { dashboardRoutes } from "./dashboard.routes";
import { GroupProjectProvider } from "../providers/GroupProjectProvider";

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
        <GroupProjectProvider>
          <PrivateRoute> {dashboardRoutes.element}</PrivateRoute>
        </GroupProjectProvider>
      </AuthProvider>
    ),
    children: dashboardRoutes.children,
  },
  { path: "/", element: <Navigate to="/dashboard" /> },
]);
