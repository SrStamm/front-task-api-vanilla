import { FaArrowAltCircleRight, FaTasks } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoProject } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import GroupSelector from "../Selector/GroupSelector";
import ProjectSelector from "../Selector/ProjectSelector";
import { useEffect, useState } from "react";
import { useGroupProject } from "../../../hooks/useGroupProject";
import UserOptions from "../UserOptions";
import SidebarItem from "../SidebarItem";
import "./Sidebar.css";

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
              <SidebarItem
                to="/dashboard"
                icon={<RxDashboard />}
                label="Dashboard"
                isSelected={elementSelected == "dashboard"}
                onClick={() => setElementSelected("dashboard")}
              />
              <SidebarItem
                to="/dashboard/projects"
                icon={<GoProject />}
                label="Proyectos"
                isSelected={elementSelected == "projects"}
                onClick={() => setElementSelected("projects")}
              />
              <SidebarItem
                to="/dashboard/tasks"
                icon={<FaTasks />}
                label="Tareas"
                isSelected={elementSelected == "tasks"}
                onClick={() => setElementSelected("tasks")}
              />
              <SidebarItem
                to="/dashboard/chat"
                icon={<IoChatboxEllipsesOutline />}
                label="Chat"
                isSelected={elementSelected == "chat"}
                onClick={() => setElementSelected("chat")}
              />
            </div>
          </div>
        </nav>

        {/* Zona 3: Perfil */}
        <div style={{ position: "relative" }}>
          <div className="sidebar_element" onClick={handleShowUserOptions}>
            <span className="sidebar_item_icon">
              <FaRegUserCircle />
            </span>
            <span className="sidebar_item_text">User</span>
          </div>
          {showUserOptions && <UserOptions />}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
