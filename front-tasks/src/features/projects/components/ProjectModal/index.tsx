import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type {
  PermissionProject,
  ReadProject,
} from "../../../projects/schemas/Project";
import UserListProject from "../../../users/component/UserListProject";
import "./ProjectModal.css";
import { useProjects } from "../../hooks/useProject";
import { getUserDataInProject } from "../../api/ProjectService.ts";
import ErrorContainer from "../../../../components/common/ErrorContainer";
import TaskCard from "../../../tasks/components/TaskCard/index.tsx";
import { FetchTaskToProject } from "../../../tasks/api/TaskService.ts";
import { ReadAllTaskFromProjectInterface } from "../../../tasks/schemas/Tasks.ts";

interface projectModalProps {
  open: boolean;
  onClose: () => void;
  project: ReadProject;
  deleteProject: (groupId: number, projectId: number) => void;
  onEdit: (project: ReadProject) => void;
  onShowListUser: () => void;
}

function ProjectModal({
  open,
  onClose,
  project,
  deleteProject,
  onEdit,
  onShowListUser,
}: projectModalProps) {
  const [tabSelected, setTabSelected] = useState("members");
  const [permission, setPermission] = useState<PermissionProject | null>(null);
  const [tasks, setTasks] = useState<ReadAllTaskFromProjectInterface[]>([]);
  const { removeUserFromProject } = useProjects();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserDataInProject(
        project.group_id,
        project.project_id,
      );

      setPermission(response.permission);
    };

    fetchData();
  }, [project]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await FetchTaskToProject({
        projectId: project.project_id,
        filters: {
          state: ["en proceso", "sin empezar"],
          label: "",
        },
      });

      setTasks(response);
    };

    fetchData();
  }, [project]);

  const header = <h2>{project.title}</h2>;

  const body = (
    <>
      <div className="modal-section">
        <p className="modal-description">{project.description}</p>
      </div>

      <div className="modal-tabs">
        <button
          className={`tab-btn ${tabSelected == "tasks" ? "active" : ""}`}
          onClick={() => setTabSelected("tasks")}
        >
          Tareas
        </button>
        <button
          className={`tab-btn ${tabSelected == "members" ? "active" : ""}`}
          onClick={() => setTabSelected("members")}
        >
          Miembros
        </button>
      </div>

      <div
        className={`modal-section tab-content ${tabSelected == "tasks" ? "active" : ""}`}
      >
        <div className="modal-section-header">
          <h4 className="modal-subtitle">Tareas</h4>
          <div className="modal-section-action ">
            <Button className="btn-primary btn-vsm" text="Crear Tarea" />
          </div>
        </div>

        <ul className="task-project-list">
          {tasks.length === 0 ? (
            <ErrorContainer
              advice="No hay tareas en este proyecto"
              recommendation=""
              isButton={false}
              isError={false}
            />
          ) : (
            tasks.map((t) => {
              return <TaskCard key={t.task_id} task={t} />;
            })
          )}
        </ul>
      </div>

      <div
        className={`modal-section tab-content ${tabSelected == "members" ? "active" : ""}`}
      >
        <div className="modal-section-header ">
          <h4 className="modal-subtitle">Miembros</h4>
          <Button
            className="btn-primary btn-vsm"
            text="Agregar Usuario"
            onClick={onShowListUser}
          />
        </div>

        <UserListProject
          users={project.users}
          groupId={project.group_id}
          projectId={project.project_id}
          onDelete={removeUserFromProject}
        />
      </div>
    </>
  );

  const actions =
    permission === "admin" ? (
      <>
        <Button
          className="bt-sm btn-secondary btn-sm"
          text="Editar"
          onClick={() => onEdit(project)}
        />
        <Button
          className="btn-sm btn-error btn-sm"
          text="Eliminar"
          onClick={() => deleteProject(project.group_id, project.project_id)}
        />
      </>
    ) : (
      ""
    );

  return (
    <Modal
      onClose={onClose}
      showModal={open}
      size="large"
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
    />
  );
}

export default ProjectModal;
