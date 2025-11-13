import { FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoProject } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { Outlet, Link } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="principal-layout">
      <aside className="sidebar-container">
        <div className="sidebar">
          <h1>Project Manager</h1>
          <nav>
            <div>
              <Link to="/dashboard/groups" className="sidebar_element">
                <FaUserGroup />
                <span>"Grupo actual"</span>
              </Link>
              <div className="sidebar_element">
                <RxDashboard />
                <span>Dashboard</span>
              </div>
              <div className="sidebar_element">
                <GoProject />
                <span>Proyectos</span>
              </div>
              <div className="sidebar_element">
                <FaTasks />
                <span>Tareas</span>
              </div>
              <div className="sidebar_element">
                <IoChatboxEllipsesOutline /> Chat
              </div>
            </div>
          </nav>
        </div>
        <div>
          <div className="sidebar_element">
            <FaRegUserCircle /> User
          </div>
        </div>
      </aside>

      <main className="dashboard-layout">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
