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
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  return null;
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
          const token = localStorage.getItem("token");
          if (token) {
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
