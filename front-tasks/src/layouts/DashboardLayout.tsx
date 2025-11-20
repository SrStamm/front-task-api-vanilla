import "./DashboardLayout.css";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar/Sidebar";

function DashboardLayout() {
  return (
    <div className="principal-layout">
      <Sidebar />

      <main className="dashboard-layout">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
