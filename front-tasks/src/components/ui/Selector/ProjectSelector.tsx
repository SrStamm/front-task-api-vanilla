import { useEffect, useRef, useState } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { setProjectId, groupId, setPermission } = useGroupProject();
  const { projects, loadProjects } = useProjects();

  const menuId = "project-selector-menu";

  const toggleDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      selectorRef.current &&
      !selectorRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Solo cargar proyectos cuando groupId cambia explícitamente
  const prevGroupIdRef = useRef<number | null | undefined>(groupId);

  useEffect(() => {
    // Solo ejecutar si groupId cambió realmente
    if (groupId !== prevGroupIdRef.current) {
      prevGroupIdRef.current = groupId;
      setProjectId(null);
      loadProjects();
    }
  }, [groupId]); // Solo groupId como dependencia

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        // Find first focusable item
        for (let i = 0; i < itemRefs.current.length; i++) {
          if (itemRefs.current[i]) {
            itemRefs.current[i]?.focus();
            break;
          }
        }
      }, 0);
    }
  }, [isOpen, projects]);

  const handleSelectProject = async (project_id: number, title: string) => {
    setProjectId(project_id);
    setTitle(title);
    setIsOpen(false);
    triggerRef.current?.focus();

    const res = await getUserDataInProject(groupId, project_id);
    setPermission(res.permission);
  };

  const getFocusableItems = () => {
    if (projects == undefined || projects.length === 0) {
      return [];
    }
    return projects;
  };

  const focusItem = (index: number) => {
    const items = getFocusableItems();
    if (items.length === 0) return;
    const normalizedIndex = ((index % items.length) + items.length) % items.length;
    itemRefs.current[normalizedIndex]?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "Tab") {
      setIsOpen(false);
      return;
    }
    const items = getFocusableItems();
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const activeElement = document.activeElement;
      const index = itemRefs.current.findIndex((ref) => ref === activeElement);
      if (index === -1) {
        focusItem(0);
      } else {
        focusItem(index + 1);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const activeElement = document.activeElement;
      const index = itemRefs.current.findIndex((ref) => ref === activeElement);
      if (index === -1) {
        focusItem(items.length - 1);
      } else {
        focusItem(index - 1);
      }
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      focusItem(items.length - 1);
      return;
    }
  };

  return (
    <div className="workspace-selector" ref={selectorRef}>
      <button
        type="button"
        ref={triggerRef}
        className="btn btn-outline-primary btn-med"
        onClick={toggleDropDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onKeyDown={handleTriggerKeyDown}
      >
        {isCollapsed ? "" : text}
      </button>

      <div
        id={menuId}
        className={`dropdown-menu ${isOpen ? "is-open" : ""}`}
        role="menu"
        onKeyDown={handleMenuKeyDown}
      >
        <ol className="menu">
          {projects == undefined ? (
            <li className="error" role="none">
              <span role="menuitem" aria-disabled="true">
                Selecciona un grupo
              </span>
            </li>
          ) : projects.length > 0 ? (
            projects.map((p, idx) => (
              <li key={p.project_id} className="item" role="none">
                <button
                  type="button"
                  role="menuitem"
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className="item"
                  onClick={() => {
                    handleSelectProject(p.project_id, p.title);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectProject(p.project_id, p.title);
                    }
                  }}
                >
                  {p.title}
                </button>
              </li>
            ))
          ) : (
            <li className="warning" role="none">
              <span role="menuitem" aria-disabled="true">
                No hay proyectos
              </span>
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}

export default ProjectSelector;
