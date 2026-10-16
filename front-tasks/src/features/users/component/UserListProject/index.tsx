import Button from "../../../../components/common/Button";
import type {
  AddRemoveUserToProject,
  PermissionProject,
  UserInProject,
} from "../../../projects/schemas/Project";
import UserCard from "../UserCard";
import "./UserListProject.css";

interface userListProps {
  users: UserInProject[];
  groupId: number;
  projectId: number;
  onDelete: (data: AddRemoveUserToProject) => Promise<void>;
  permission?: PermissionProject;
}

function UserListProject({
  users,
  groupId,
  projectId,
  onDelete,
  permission,
}: userListProps) {
  const handleDelete = async (user_id: number) => {
    try {
      await onDelete({
        group_id: groupId,
        project_id: projectId,
        user_id,
      });
    } catch {
      // Toast se encarga del error global
    }
  };

  return (
    <ul className="listUser">
      {users.map((u) => {
        const actions =
          permission === "admin" ? (
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
                onClick={() => handleDelete(u.user_id)}
              />
            </>
          ) : (
            ""
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
