import { useEffect, useRef, useState } from "react";
import Button from "../../common/Button";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { useProjects } from "../../../features/projects/hooks/useProject";
import { getUserDataInProject } from "../../../features/projects/api/ProjectService";
import "./Selector.css";

type selectorProps = {
  text: string;
  setTitle: (name: string) => void;
  isCollapsed: boolean;
};

function ProjectSelector({ text, setTitle, isCollapsed }: selectorProps) {
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { setProjectId, groupId, setPermission } = useGroupProject();
  const { projects, loadProjects } = useProjects();

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      selectorRef.current &&
      !selectorRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setProjectId(null);
    loadProjects();
  }, [groupId, setProjectId, loadProjects]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectorRef]);

  const handleSelectProject = async (project_id: number, title: string) => {
    setProjectId(project_id);
    setTitle(title);
    setIsOpen(false);

    const res = await getUserDataInProject(groupId, project_id);
    setPermission(res.permission);
  };

  return (
    <div className="workspace-selector" ref={selectorRef}>
      <Button
        className="btn-outline-primary btn-med"
        text={isCollapsed ? "" : `${text} ▼`}
        onClick={toggleDropDown}
      />

      <div className={`dropdown-menu ${isOpen ? "is-open" : ""}`}>
        <ol className="menu">
          {projects == undefined ? (
            <li className="error">Selecciona un grupo</li>
          ) : projects.length > 0 ? (
            projects.map((p) => (
              <li
                key={p.project_id}
                className="item"
                onClick={() => {
                  handleSelectProject(p.project_id, p.title);
                }}
              >
                {p.title}
              </li>
            ))
          ) : (
            <li className="warning">No hay proyectos</li>
          )}
        </ol>
      </div>
    </div>
  );
}

export default ProjectSelector;
