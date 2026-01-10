import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { useGroups } from "../../../features/groups/hooks/useGroups";
import Button from "../../common/Button";
import "./Selector.css";

type selectorProps = {
  text: string;
  setName: (name: string) => void;
  isCollapsed: boolean;
};

function GroupSelector({ text, setName, isCollapsed }: selectorProps) {
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { setGroupId } = useGroupProject();
  const { groups } = useGroups();

  const handleClickOutside = (e: MouseEvent) => {
    if (
      selectorRef.current &&
      !selectorRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectorRef]);

  return (
    <div className="workspace-selector" ref={selectorRef}>
      <Button
        className="btn-outline-primary btn-med"
        text={isCollapsed ? "" : `${text} ▼`}
        onClick={toggleDropDown}
      />

      <div className={`dropdown-menu ${isOpen ? "is-open" : ""}`}>
        <ol className="menu">
          {groups.map((g) => (
            <li
              key={g.group_id}
              className="item"
              onClick={() => {
                setGroupId(g.group_id);
                setIsOpen(false);
                setName(g.name);
              }}
            >
              {g.name}
            </li>
          ))}
        </ol>

        <Link to="/dashboard/groups">
          <Button
            className="btn-outline-secondary btn-med"
            text="Todos los grupos"
            onClick={toggleDropDown}
          />
        </Link>
      </div>
    </div>
  );
}

export default GroupSelector;
