import Button from "../../../../components/common/Button";
import type { UserInGroup } from "../../../groups/schemas/Group";
import UserCard from "../UserCard";

interface userListProps {
  users: UserInGroup[];
}

function UserListGroup({ users }: userListProps) {
  const actions = (
    <>
      <select disabled={true} style={{ display: "none" }}>
        <option value="member">Miembro</option>
        <option value="editor">Editor</option>
        <option value="admin">Administrador</option>
      </select>

      <Button className="btn-vsm btn-outline-secondary" text="Editar" />
      <Button className="btn-vsm btn-outline-error" text="Eliminar" />
    </>
  );

  return (
    <ul className="listUser">
      {users.map((u) => {
        return (
          <li key={u.user_id} className="user-item">
            <UserCard userGroup={u} type="group" actions={actions} />
          </li>
        );
      })}
    </ul>
  );
}

export default UserListGroup;
