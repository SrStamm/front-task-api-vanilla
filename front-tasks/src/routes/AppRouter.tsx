// Definition for public and private routes

import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <GroupProjectProvider>
            <PrivateRoute> {dashboardRoutes.element}</PrivateRoute>
          </GroupProjectProvider>
        ),
        children: dashboardRoutes.children,
      },
      { path: "/", element: <Navigate to="/dashboard" /> },
    ],
  },
]);
