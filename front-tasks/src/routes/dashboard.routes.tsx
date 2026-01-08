import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import ChatPage from "../pages/Dashboard/ChatPage/ChatPage.tsx";
import GroupsPage from "../pages/Dashboard/GroupsPage";
import ProjectsPage from "../pages/Dashboard/ProjectsPage";
import TasksPage from "../pages/Dashboard/TasksPage/TasksPage.tsx";
import { PrivateRoute } from "./ProtectedRoute.tsx";

export const dashboardRoutes = {
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { path: "groups", element: <GroupsPage /> },
    { path: "projects", element: <ProjectsPage /> },
    { path: "tasks", element: <TasksPage /> },
    { path: "chat", element: <ChatPage /> },
  ],
};
