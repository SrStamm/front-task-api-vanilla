// Definition for public and private routes
import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { AuthProvider } from "../providers/AuthProvider";
import { PublicRoute } from "./PublicRoute";
import { GroupProjectProvider } from "../providers/GroupProjectProvider";
import { PrivateRoute } from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import GroupsPage from "../pages/Dashboard/GroupsPage";
import ProjectsPage from "../pages/Dashboard/ProjectsPage";
import TasksPage from "../pages/Dashboard/TasksPage/TasksPage.tsx";
import ChatPage from "../pages/Dashboard/ChatPage/ChatPage.tsx";
import "../App.css";

const requireAuthLoader = async () => {
  console.log("🔍 requireAuthLoader ejecutándose");
  const token = localStorage.getItem("token");
  console.log("🔑 Token encontrado:", !!token);

  if (!token) {
    console.log("❌ No hay token, redirigiendo a /login");
    return redirect("/login");
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_URL}user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.log("❌ Token inválido, limpiando");
      localStorage.removeItem("token");
      return redirect("/login");
    }

    const userData = await res.json();
    console.log("✅ Usuario autenticado:", userData.username);
    return userData;
  } catch (error) {
    console.error("⚠️ Error en requireAuthLoader:", error);
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
          console.log("🔍 Login loader - Verificando token...");
          const token = localStorage.getItem("token");
          if (token) {
            console.log(
              "✅ Token encontrado en login, redirigiendo a /dashboard",
            );
            return redirect("/dashboard");
          }
          console.log("ℹ️ No hay token, mostrando login");
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
              <DashboardLayout />
            </GroupProjectProvider>
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <GroupsPage /> }, // Redirige internamente
          { path: "groups", element: <GroupsPage /> },
          { path: "projects", element: <ProjectsPage /> },
          { path: "tasks", element: <TasksPage /> },
          { path: "chat", element: <ChatPage /> },
        ],
      },
      {
        path: "/",
        loader: () => {
          console.log("🔍 Root loader - Redirigiendo a /dashboard");
          return redirect("/dashboard");
        },
      },
      {
        path: "*",
        element: <div>404 - Página no encontrada</div>,
      },
    ],
  },
]);
