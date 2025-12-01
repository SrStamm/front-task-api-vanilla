import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import GroupsPage from "../pages/Dashboard/GroupsPage";
import ProjectsPage from "../pages/Dashboard/ProjectsPage";
import TasksPage from "../pages/Dashboard/TasksPage/TasksPage.tsx";

export const dashboardRoutes = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    { path: "groups", element: <GroupsPage /> },
    { path: "projects", element: <ProjectsPage /> },
    { path: "tasks", element: <TasksPage /> },
  ],
};
