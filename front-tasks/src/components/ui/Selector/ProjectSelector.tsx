import { useState } from "react";
import Button from "../../common/Button";
import "./Selector.css";
import { useGroupProject } from "../../../hooks/useGroupProject";
import { Link } from "react-router-dom";

type selectorProps = {
  text: string;
  setTitle: (name: string) => void;
};

const projects = [
  { id: 1, title: "Probando" },
  { id: 2, title: "Insomnia" },
  { id: 3, title: "Insomnia" },
  { id: 4, title: "Insomnia" },
  { id: 5, title: "Insomnia" },
  { id: 6, title: "Insomnia" },
  { id: 7, title: "Insomnia" },
  { id: 8, title: "Insomnia" },
  { id: 9, title: "Insomnia" },
];

function ProjectSelector({ text, setTitle }: selectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { setProjectId } = useGroupProject();

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
          {projects.map((p) => (
            <li key={p.id}>
              <Button
                className="btn-primary btn-vsm-long"
                text={p.title}
                onClick={() => {
                  setProjectId(p.id);
                  setIsOpen(false);
                  console.log(p.title);
                  setTitle(p.title);
                }}
              />
            </li>
          ))}
        </ol>

        <Link to="/dashboard/projects">
          <Button
            className="btn-outline-secondary btn-med"
            text="Todos los proyectos"
            onClick={toggleDropDown}
          />
        </Link>
      </div>
    </div>
  );
}

export default ProjectSelector;
