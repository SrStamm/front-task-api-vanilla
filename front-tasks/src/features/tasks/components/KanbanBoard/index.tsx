// Container - organize the columns by status - use useTasks

import "./KanbanBoard.css";
import Column from "../Column";
import TaskModal from "../../components/TaskModal/index.tsx";
import { useMemo, useState } from "react";
import type { ReadAllTaskFromProjectInterface } from "../../schemas/Tasks.ts";
import { useGroupProject } from "../../../../hooks/useGroupProject.ts";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TaskCard from "../TaskCard/index.tsx";
import { TaskStateEnum } from "../../schemas/Tasks.ts";
import { UpdateTask } from "../../../../types/Task.ts";
import ErrorContainer from "../../../../components/common/ErrorContainer/index.tsx";

interface KanbanBoardProps {
  tasksInProject: ReadAllTaskFromProjectInterface[];
  isLoading: boolean;
  error: string | null;
  onEdit: (t: ReadAllTaskFromProjectInterface) => void;
  onUpdate: (data: UpdateTask) => Promise<void>;
  childModal: boolean;
}

function KanbanBoard({
  tasksInProject,
  isLoading,
  error,
  onEdit,
  onUpdate,
  childModal,
}: KanbanBoardProps) {
  const { projectId } = useGroupProject();
  const [isShowModal, setShowModal] = useState(false);
  const [taskSelected, setTaskSelected] =
    useState<ReadAllTaskFromProjectInterface | null>(null);
  const [activeId, setActiveId] = useState(0);
  const [activeTask, setActiveTask] =
    useState<ReadAllTaskFromProjectInterface | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const { todoTasks, inProgressTasks, doneTasks } = useMemo(() => {
    if (!tasksInProject.length) {
      return { todoTasks: [], inProgressTasks: [], doneTasks: [] };
    }

    const todo = tasksInProject.filter((t) => t.state === "sin empezar");
    const inProgress = tasksInProject.filter((t) => t.state === "en proceso");
    const done = tasksInProject.filter((t) => t.state === "completado");

    return { todoTasks: todo, inProgressTasks: inProgress, doneTasks: done };
  }, [tasksInProject]);

  if (isLoading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (error)
    return (
      <ErrorContainer
        advice={error}
        recommendation=""
        isButton={true}
        isError={true}
      />
    );

  const handleShowModal = (taskId: number) => {
    const selected = tasksInProject.find((t) => t.task_id === taskId);

    if (selected) {
      setTaskSelected(selected);
      setShowModal(true);
    } else {
      console.error(`Tarea ${taskId} no encontrada.`);
    }
  };

  const handleHideModal = () => {
    if (childModal) {
      return;
    }

    setShowModal(false);
  };

  if (tasksInProject.length === 0 && projectId) {
    return (
      <ErrorContainer
        advice="No hay tareas en este proyecto"
        recommendation="Crea tu primera tarea haciendo click en el botón '+'"
        isButton={false}
        isError={false}
      />
    );
  } else if (!projectId) {
    return (
      <ErrorContainer
        advice="No se ha seleccionado ningún proyecto"
        recommendation="Seleccione un proyecto en 'Proyecto actual'"
        isButton={false}
        isError={false}
      />
    );
  }

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const id = Number(active.id);

    setActiveId(Number(id));

    const task = tasksInProject.find((t) => t.task_id == id);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { over } = e;

    const destinationColumn = String(over.id);

    const newState: TaskStateEnum =
      destinationColumn === "To Do"
        ? "sin empezar"
        : destinationColumn === "In Progress"
          ? "en proceso"
          : "completado";

    if (activeTask && activeTask.state !== newState) {
      const payload: UpdateTask = {
        project_id: projectId,
        task_id: activeTask.task_id,
        state: newState,
      };

      onUpdate(payload);
    }

    setActiveId(0);
    setActiveTask(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="task-container">
          <Column
            column_text="To Do"
            tasks={todoTasks}
            onShowModal={handleShowModal}
          />
          <Column
            column_text="In Progress"
            tasks={inProgressTasks}
            onShowModal={handleShowModal}
          />
          <Column
            column_text="Done"
            tasks={doneTasks}
            onShowModal={handleShowModal}
          />
        </div>
        <DragOverlay>
          {activeId ? (
            <TaskCard task={activeTask} onShowTaskModal={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {taskSelected && (
        <TaskModal
          isShow={isShowModal}
          task={taskSelected}
          onClose={handleHideModal}
          onEdit={onEdit}
        />
      )}
    </>
  );
}

export default KanbanBoard;
