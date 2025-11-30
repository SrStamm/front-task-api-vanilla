import Button from "../../../../components/common/Button";
import type { UserInGroup } from "../../../groups/schemas/Group";
import UserCard from "../UserCard";
import "./UserListGroup.css";

interface userListProps {
  users: UserInGroup[];
  addUser: boolean;
}

function UserListGroup({ users, addUser }: userListProps) {
  const actions = addUser ? (
    <>
      <Button className="btn-vsm btn-outline-secondary" text="Agregar" />
    </>
  ) : (
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

  return addUser ? (
    <ul className="list-add-user">
      {users.map((u) => {
        return (
          <li key={u.user_id} className="user-add">
            <UserCard userGroup={u} type="group" actions={actions} />
          </li>
        );
      })}
    </ul>
  ) : (
    <ul className="listUser">
      {users.map((u) => {
        return (
          <li key={u.user_id} className="user-add">
            <UserCard userGroup={u} type="group" actions={actions} />
          </li>
        );
      })}
    </ul>
  );
}

export default UserListGroup;
