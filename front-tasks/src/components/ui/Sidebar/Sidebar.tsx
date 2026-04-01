import { FaChevronLeft, FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoProject } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import GroupSelector from "../Selector/GroupSelector";
import ProjectSelector from "../Selector/ProjectSelector";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGroupProject } from "../../../hooks/useGroupProject";
import UserOptions from "../UserOptions";
import SidebarItem from "../SidebarItem";
import "./Sidebar.css";

function Sidebar() {
  const [groupName, setGroupName] = useState<string | undefined>();
  const [projectTitle, setProjectTitle] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [elementSelected, setElementSelected] = useState("groups");
  const [showUserOptions, setShowUserOptions] = useState(false);
  const { groupId } = useGroupProject();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleClickOutside = (e: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  useEffect(() => {
    setProjectTitle(undefined);
  }, [groupId]);

  // Detectar la ruta actual y seleccionar el item correspondiente
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path.endsWith("/groups")) {
      setElementSelected("groups");
    } else if (path.endsWith("/projects")) {
      setElementSelected("projects");
    } else if (path.endsWith("/tasks")) {
      setElementSelected("tasks");
    } else if (path.endsWith("/chat")) {
      setElementSelected("chat");
    }
  }, [location.pathname]);

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
      className={`sidebar-container ${isCollapsed ? "is-collapsed" : ""}`}
      ref={sidebarRef}
    >
      <div className={`sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
        {/* Header con título y botón de collapse */}
        <div className="sidebar-header">
          <h1 className="sidebar-title">Project Manager</h1>
          <button 
            className="collapse-btn" 
            onClick={handleCollapseSidebar}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <FaChevronLeft className="collapse-icon" />
          </button>
        </div>

        {/* Selectors - solo visibles cuando NO está colapsado */}
        {!isCollapsed && (
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
        )}

        {/* Navegación */}
        <nav className="sidebar-nav">
          <SidebarItem
            to="/dashboard"
            icon={<RxDashboard />}
            label="Dashboard"
            isSelected={elementSelected == "dashboard"}
            onClick={() => setElementSelected("dashboard")}
            showTooltip={isCollapsed}
          />
          <SidebarItem
            to="/dashboard/projects"
            icon={<GoProject />}
            label="Proyectos"
            isSelected={elementSelected == "projects"}
            onClick={() => setElementSelected("projects")}
            showTooltip={isCollapsed}
          />
          <SidebarItem
            to="/dashboard/tasks"
            icon={<FaTasks />}
            label="Tareas"
            isSelected={elementSelected == "tasks"}
            onClick={() => setElementSelected("tasks")}
            showTooltip={isCollapsed}
          />
          <SidebarItem
            to="/dashboard/chat"
            icon={<IoChatboxEllipsesOutline />}
            label="Chat"
            isSelected={elementSelected == "chat"}
            onClick={() => setElementSelected("chat")}
            showTooltip={isCollapsed}
          />
        </nav>

        {/* Footer con usuario */}
        <div className="sidebar-footer">
          <div 
            className="user-profile"
            onClick={handleShowUserOptions}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleShowUserOptions()}
          >
            <span className="user-icon">
              <FaRegUserCircle />
            </span>
            {!isCollapsed && <span className="user-name">User</span>}
          </div>
          {showUserOptions && <UserOptions close={handleShowUserOptions} />}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
