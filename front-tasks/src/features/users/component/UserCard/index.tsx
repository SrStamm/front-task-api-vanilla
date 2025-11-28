import type React from "react";
import type { ReadUser } from "../../../../types/User";
import type { UserInGroup } from "../../../groups/schemas/Group";
import type { UserInProject } from "../../../projects/schemas/Project";
import "./UserCard.css";

interface UserCardProps {
  user?: ReadUser;
  userProject?: UserInProject;
  userGroup?: UserInGroup;

  type: string;
  actions: React.ReactNode;
}

function UserCard({
  user,
  userProject,
  userGroup,
  type,
  actions,
}: UserCardProps) {
  const username =
    type == "project"
      ? userProject?.username
      : type == "group"
        ? userGroup?.username
        : user?.username;

  const permission =
    type == "project"
      ? userProject?.permission
      : type == "group"
        ? userGroup?.role
        : "";
  return (
    <>
      <div className="user-info">
        <div className="user-details">
          <p>{username}</p>
          <p className="currentPermission user-role"> {permission}</p>
        </div>
      </div>
      <div className="user-actions">{actions}</div>
    </>
  );
}

export default UserCard;
