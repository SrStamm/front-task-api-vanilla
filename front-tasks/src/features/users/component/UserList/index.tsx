import Button from "../../../../components/common/Button";
import ErrorContainer from "../../../../components/common/ErrorContainer";
import type { ReadUser } from "../../../../types/User";
import UserCard from "../UserCard";

interface userListProps {
  users: ReadUser[];
  onAdd: (user_id: number) => void;
  userIdAssigned?: number;
  text?: string;
  textAssigned?: string;
}

function UserList({
  users,
  onAdd,
  userIdAssigned,
  text,
  textAssigned,
}: userListProps) {
  const getText = (id: number) => {
    if (id == userIdAssigned) {
      return textAssigned ?? "Agregado";
    }

    return text ?? "Agregar";
  };

  return (
    <ul className="list-add-user">
      {users.length > 0 ? (
        users.map((u) => {
          const actions = (
            <Button
              className="btn-vsm btn-outline-error"
              text={getText(u.user_id)}
              disabled={userIdAssigned == u.user_id ? true : false}
              onClick={() => onAdd(u.user_id)}
            />
          );
          return (
            <li key={u.user_id} className="user-add">
              <UserCard type="user" user={u} actions={actions} />
            </li>
          );
        })
      ) : (
        <ErrorContainer
          isButton={false}
          isError={false}
          advice="No hay usuarios para agregar"
          recommendation=""
        />
      )}
    </ul>
  );
}

export default UserList;
