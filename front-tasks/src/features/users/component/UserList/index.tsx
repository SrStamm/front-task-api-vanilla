import Button from "../../../../components/common/Button";
import type { ReadUser } from "../../../../types/User";
import UserCard from "../UserCard";

interface userListProps {
  users: ReadUser[];
  onAdd: (user_id: number) => void;
}

function UserList({ users, onAdd }: userListProps) {
  return (
    <ul className="list-add-user">
      {users.map((u) => {
        const actions = (
          <Button
            className="btn-vsm btn-outline-error"
            text="Agregar"
            onClick={() => onAdd(u.user_id)}
          />
        );
        return (
          <li key={u.user_id} className="user-add">
            <UserCard type="user" user={u} actions={actions} />
          </li>
        );
      })}
    </ul>
  );
}

export default UserList;
