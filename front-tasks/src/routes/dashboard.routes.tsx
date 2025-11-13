import DashboardLayout from "../layouts/DashboardLayout";
import GroupsPage from "../pages/Dashboard/GroupsPage";

export const dashboardRoutes = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [{ path: "groups", element: <GroupsPage /> }],
};
