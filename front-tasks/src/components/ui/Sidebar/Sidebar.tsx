import { FaArrowAltCircleRight, FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoProject } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import GroupSelector from "../Selector/GroupSelector";
import ProjectSelector from "../Selector/ProjectSelector";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useGroupProject } from "../../../hooks/useGroupProject";
import UserOptions from "../UserOptions";

function Sidebar() {
  const [groupName, setGroupName] = useState<string | undefined>();
  const [projectTitle, setProjectTitle] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [elementSelected, setElementSelected] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);
  const { groupId } = useGroupProject();

  useEffect(() => {
    setProjectTitle(undefined);
  }, [groupId]);

  const handleShowUserOptions = () => {
    setShowUserOptions(!showUserOptions);
  };

  const handleCollapseSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const root = document.documentElement;

    if (isCollapsed) {
      root.style.setProperty("--sidebar-width", "80px");
    } else {
      root.style.setProperty("--sidebar-width", "250px");
    }
  }, [isCollapsed]);

  return (
    <aside
      className={
        isCollapsed ? "sidebar-container is-collapsed" : "sidebar-container"
      }
    >
      <div className={isCollapsed ? "sidebar is-collapsed" : "sidebar"}>
        <div className="sidebar_header">
          <button className="collapse_button" onClick={handleCollapseSidebar}>
            <FaArrowAltCircleRight className="collapse_button_item" />
          </button>
        </div>
        <h1>Project Manager</h1>
        <nav>
          <div className="sidebar_intern">
            {/* Zona 1: Contexto */}

            <div className="selectors">
              <GroupSelector
                text={groupName == undefined ? "Grupo" : groupName}
                setName={setGroupName}
                isCollapsed={isCollapsed}
              />

              <ProjectSelector
                text={projectTitle == undefined ? "Proyecto" : projectTitle}
                setTitle={setProjectTitle}
                isCollapsed={isCollapsed}
              />
            </div>

            {/* Zona 2: Navegación */}
            <div className="sidebar_navigation">
              <div
                className={`sidebar_element ${elementSelected == "dashboard" ? "active" : ""}`}
                onClick={() => setElementSelected("dashboard")}
              >
                <RxDashboard className="sidebar_item" />
                <span>Dashboard</span>
              </div>

              <div
                className={`sidebar_element ${elementSelected == "projects" ? "active" : ""}`}
                onClick={() => setElementSelected("projects")}
              >
                <Link to="/dashboard/projects" className="sidebar_link">
                  <GoProject className="sidebar_item" />
                  <span>Proyectos</span>
                </Link>
              </div>

              <div
                className={`sidebar_element ${elementSelected == "tasks" ? "active" : ""}`}
                onClick={() => setElementSelected("tasks")}
              >
                <Link to="/dashboard/tasks" className="sidebar_link">
                  <FaTasks className="sidebar_item" />
                  <span>Tareas</span>
                </Link>
              </div>

              <div
                className={`sidebar_element ${elementSelected == "chat" ? "active" : ""}`}
                onClick={() => setElementSelected("chat")}
              >
                <Link to="/dashboard/chat" className="sidebar_link">
                  <IoChatboxEllipsesOutline className="sidebar_item" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Zona 3: Perfil */}
      <div style={{ position: "relative" }}>
        <div className="sidebar_element" onClick={handleShowUserOptions}>
          <FaRegUserCircle className="sidebar_item" />
          <span>User</span>
        </div>
        {showUserOptions && <UserOptions />}
      </div>
    </aside>
  );
}

export default Sidebar;
