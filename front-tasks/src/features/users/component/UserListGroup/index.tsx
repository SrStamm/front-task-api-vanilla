import Button from "../../../../components/common/Button";
import ErrorContainer from "../../../../components/common/ErrorContainer";
import type { UserInGroup } from "../../../groups/schemas/Group";
import UserCard from "../UserCard";
import "./UserListGroup.css";

interface userListProps {
  users: UserInGroup[];
  addUser: boolean;
  onAdd?: (userId: number) => void;
  isAdding?: boolean;
}

function UserListGroup({
  users,
  addUser,
  onAdd,
  isAdding,
}: userListProps) {
  return addUser ? (
    <ul className="list-add-user">
      {users.length > 0 ? (
        users.map((u) => {
          return (
            <li key={u.user_id} className="user-add">
              <UserCard
                userGroup={u}
                type="group"
                actions={
                  <>
                    <Button
                      className="btn-vsm btn-outline-secondary"
                      text="Agregar"
                      disabled={isAdding}
                      onClick={() => onAdd(u.user_id)}
                    />
                  </>
                }
              />
            </li>
          );
        })
      ) : (
        <ErrorContainer
          advice="No hay usuarios en el grupo para agregar "
          recommendation="Se implementará próximamente"
          isButton={false}
          isError={true}
        />
      )}
    </ul>
  ) : (
    <ul className="listUser">
      {users.map((u) => {
        return (
          <li key={u.user_id} className="user-item">
            <UserCard userGroup={u} type="group" actions={<></>} />
          </li>
        );
      })}
    </ul>
  );
}

export default UserListGroup;
