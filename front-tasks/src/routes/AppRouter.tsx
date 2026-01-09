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
        element: (
          <GroupProjectProvider>{dashboardRoutes.element}</GroupProjectProvider>
        ),
        children: dashboardRoutes.children,
      },
      { path: "/", loader: () => redirect("/dashboard") },
    ],
  },
]);
