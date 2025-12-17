import { FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoProject } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import GroupSelector from "../Selector/GroupSelector";
import ProjectSelector from "../Selector/ProjectSelector";
import { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const [groupName, setGroupName] = useState<string | undefined>();
  const [projectTitle, setProjectTitle] = useState<string | undefined>();
  const [elementSelected, setElementSelected] = useState("");

  return (
    <aside className="sidebar-container">
      <div className="sidebar">
        <h1>Project Manager</h1>
        <nav>
          <div className="sidebar_intern">
            {/* Zona 1: Contexto */}

            <div className="selectors">
              <GroupSelector
                text={groupName == undefined ? "Grupo actual" : groupName}
                setName={setGroupName}
              />

              <ProjectSelector
                text={
                  projectTitle == undefined ? "Proyecto actual" : projectTitle
                }
                setTitle={setProjectTitle}
              />
            </div>

            {/* Zona 2: Navegación */}
            <div>
              <div
                className={`sidebar_element ${elementSelected == "dashboard" ? "active" : ""}`}
                onClick={() => setElementSelected("dashboard")}
              >
                <RxDashboard />
                <span>Dashboard</span>
              </div>

              <div
                className={`sidebar_element ${elementSelected == "projects" ? "active" : ""}`}
                onClick={() => setElementSelected("projects")}
              >
                <Link to="/dashboard/projects" className="sidebar_link">
                  <GoProject />
                  <span>Proyectos</span>
                </Link>
              </div>

              <div
                className={`sidebar_element ${elementSelected == "tasks" ? "active" : ""}`}
                onClick={() => setElementSelected("tasks")}
              >
                <Link to="/dashboard/tasks" className="sidebar_link">
                  <FaTasks />
                  <span>Tareas</span>
                </Link>
              </div>

              <div
                className={`sidebar_element ${elementSelected == "chat" ? "active" : ""}`}
                onClick={() => setElementSelected("chat")}
              >
                <IoChatboxEllipsesOutline /> Chat
              </div>
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
