// Definition for public and private routes

import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/Dashboard";
import { AuthProvider } from "../providers/AuthProvider";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./ProtectedRoute";
import "../App.css";

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
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </AuthProvider>
    ),
  },
]);
