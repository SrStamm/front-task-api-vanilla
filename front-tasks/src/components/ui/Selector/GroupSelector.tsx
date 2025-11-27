import { useState } from "react";
import Button from "../../common/Button";
import "./Selector.css";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { Link } from "react-router-dom";

type selectorProps = {
  text: string;
  setName: (name: string) => void;
};

const groups = [
  { id: 1, name: "Probando" },
  { id: 2, name: "Insomnia" },
  { id: 3, name: "Insomnia" },
  { id: 4, name: "Insomnia" },
  { id: 5, name: "Insomnia" },
  { id: 6, name: "Insomnia" },
  { id: 7, name: "Insomnia" },
  { id: 8, name: "Insomnia" },
  { id: 9, name: "Insomnia" },
];

function GroupSelector({ text, setName }: selectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { setGroupId } = useGroupProject();

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="workspace-selector">
      <Button
        className="btn-outline-primary btn-long"
        text={`${text} ▼`}
        onClick={toggleDropDown}
      />

      <div className={`dropdown-menu ${isOpen ? "is-open" : ""}`}>
        <ol className="menu">
          {groups.map((g) => (
            <li key={g.id}>
              <Button
                className="btn-primary btn-vsm-long"
                text={g.name}
                onClick={() => {
                  setGroupId(g.id);
                  setIsOpen(false);
                  console.log(g.name);
                  setName(g.name);
                }}
              />
            </li>
          ))}
        </ol>

        <Link to="/dashboard/groups">
          <Button
            className="btn-outline-secondary btn-long"
            text="Todos los grupos"
            onClick={toggleDropDown}
          />
        </Link>
      </div>
    </div>
  );
}

export default GroupSelector;
