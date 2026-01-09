// Definition for public and private routes

import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { AuthProvider } from "../providers/AuthProvider";
import { PublicRoute } from "./PublicRoute";
import { dashboardRoutes } from "./dashboard.routes";
import { GroupProjectProvider } from "../providers/GroupProjectProvider";
import "../App.css";
import { PrivateRoute } from "./ProtectedRoute";

const requireAuthLoader = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }

  // Si falla → redirect("/login")
  try {
    const res = await fetch(`${import.meta.env.VITE_URL}user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      return redirect("/login");
    }

    return await res.json(); // o return null;
  } catch {
    localStorage.removeItem("token");
    return redirect("/login");
  }
};

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
        loader: () => {
          if (localStorage.getItem("token")) {
            return redirect("/dashboard");
          }
          return null;
        },
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
        loader: requireAuthLoader,
        element: (
          <PrivateRoute>
            <GroupProjectProvider>
              {dashboardRoutes.element}
            </GroupProjectProvider>
          </PrivateRoute>
        ),
        children: dashboardRoutes.children,
      },
      { path: "/", loader: () => redirect("/dashboard") },
    ],
  },
]);
