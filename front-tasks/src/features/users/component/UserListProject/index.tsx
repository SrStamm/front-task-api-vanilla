import Button from "../../../../components/common/Button";
import type { UserInProject } from "../../../projects/schemas/Project";
import UserCard from "../UserCard";
import "./UserListProject.css";

interface userListProps {
  users: UserInProject[];
  groupId: number;
  projectId: number;
  onDelete: (group_id: number, project_id: number, user_id: number) => void;
}

function UserListProject({
  users,
  groupId,
  projectId,
  onDelete,
}: userListProps) {
  return (
    <ul className="listUser">
      {users.map((u) => {
        const actions = (
          <>
            <select
              className="permission-select"
              disabled={true}
              style={{ display: "none" }}
            >
              <option value="read">Lectura</option>
              <option value="write">Escritura</option>
              <option value="admin">Administrador</option>
            </select>

            <Button className="btn-vsm btn-outline-secondary" text="Editar" />
            <Button
              className="btn-vsm btn-outline-error"
              text="Eliminar"
              onClick={() => onDelete(groupId, projectId, u.user_id)}
            />
          </>
        );
        return (
          <li key={u.user_id} className="user-item">
            <UserCard type="project" userProject={u} actions={actions} />
          </li>
        );
      })}
    </ul>
  );
}

export default UserListProject;
