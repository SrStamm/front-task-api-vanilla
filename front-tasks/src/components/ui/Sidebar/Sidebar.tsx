import { FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoProject } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar">
        <h1>Project Manager</h1>
        <nav>
          <div>
            {/* Zona 1: Contexto */}
            <Link to="/dashboard/groups" className="sidebar_element">
              <FaUserGroup />
              <span>Grupo actual ▼</span>
            </Link>
            <Link to="/dashboard/projects" className="sidebar_element">
              <FaUserGroup />
              <span>Proyecto actual ▼</span>
            </Link>

            {/* Zona 2: Navegación */}
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

      {/* Zona 3: Perfil */}
      <div>
        <div className="sidebar_element">
          <FaRegUserCircle /> User
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
