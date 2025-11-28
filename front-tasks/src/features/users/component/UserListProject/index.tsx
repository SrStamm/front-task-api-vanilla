import type { UserInProject } from "../../../projects/schemas/Project";
import UserCard from "../UserCard";
import "./UserListProject.css";

interface userListProps {
  users: UserInProject[];
}

function UserListProject({ users }: userListProps) {
  return users.map((u) => {
    return (
      <li className="user-item">
        <UserCard type="project" userProject={u} />
      </li>
    );
  });
}

export default UserListProject;
