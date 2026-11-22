import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { useGroups } from "../../../features/groups/hooks/useGroups";
import "./Selector.css";
import { getUserDataInGroup } from "../../../features/groups/api/GroupService";

type selectorProps = {
  text: string;
  setName: (name: string) => void;
  isCollapsed: boolean;
};

function GroupSelector({ text, setName, isCollapsed }: selectorProps) {
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { setGroupId, setRole } = useGroupProject();
  const { groups } = useGroups();

  const menuId = "group-selector-menu";

  const handleClickOutside = (e: MouseEvent) => {
    if (
      selectorRef.current &&
      !selectorRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstItem = itemRefs.current[0];
        if (firstItem) {
          firstItem.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  const handleSelectGroup = async (group_id: number, name: string) => {
    setGroupId(group_id);
    setName(name);
    setIsOpen(false);
    triggerRef.current?.focus();

    const res = await getUserDataInGroup(group_id);
    setRole(res.role);
  };

  const focusItem = (index: number) => {
    const totalItems = groups.length + 1; // groups + "Todos los grupos"
    if (totalItems === 0) return;
    const normalizedIndex = ((index % totalItems) + totalItems) % totalItems;
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
        focusItem(groups.length);
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
      focusItem(groups.length);
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
        ref={menuRef}
        className={`dropdown-menu ${isOpen ? "is-open" : ""}`}
        role="menu"
        onKeyDown={handleMenuKeyDown}
      >
        <ol className="menu">
          {groups.map((g, idx) => (
            <li key={g.group_id} className="item" role="none">
              <button
                type="button"
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="item"
                onClick={() => {
                  handleSelectGroup(g.group_id, g.name);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectGroup(g.group_id, g.name);
                  }
                }}
              >
                {g.name}
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          role="menuitem"
          ref={(el) => {
            itemRefs.current[groups.length] = el;
          }}
          className="btn-outline-secondary btn-med"
          style={{
            width: "100%",
            textAlign: "left",
            border: "none",
            background: "transparent",
          }}
          onClick={() => {
            setIsOpen(false);
            triggerRef.current?.focus();
            navigate("/dashboard/groups");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(false);
              triggerRef.current?.focus();
              navigate("/dashboard/groups");
            }
          }}
        >
          Todos los grupos
        </button>
      </div>
    </div>
  );
}

export default GroupSelector;
