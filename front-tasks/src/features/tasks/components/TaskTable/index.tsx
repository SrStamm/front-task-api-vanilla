import { useEffect, useRef } from "react";
import type { ReadTaskInterface } from "../../schemas/Tasks";
import HeaderTable from "../HeaderTable";
import RowTable from "../RowTable";
import "./TaskTable.css";

interface TaskTableProps {
  tasks: ReadTaskInterface[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

function TaskTable({
  tasks,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "#666" }}>No hay tienes tareas asignadas</p>
      </div>
    );
  }
  // 1. Ref para el elemento que estara al final de la lista
  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. Crea y configura el IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        // entries es un array, pero solo observa el primer elemento
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null, // viewport por defecto
        rootMargin: "0px", // Margen antes que se dispare
        threshold: 1.0, // Disparar cuando el elemento este 100% visible
      },
    );

    // 3. Empieza a observar el elemento si existe
    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    // 4. Limpieza: deja de observar cuando el componente se desmonte
    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <table className="task-table">
      <HeaderTable />
      <tbody>
        {tasks.map((t) => (
          <RowTable task={t} key={t.task_id} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3}>
            <div ref={observerTargetRef} className="scroll-trigger">
              {isFetchingNextPage && <p>Cargando más tareas</p>}
              {!hasNextPage && tasks.length > 0 && <p>Fin de la lista</p>}
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default TaskTable;
