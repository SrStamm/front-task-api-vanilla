import { createContext, useState } from "react";
import { RoleGroup } from "../types/Group";
import { PermissionProject } from "../features/projects/schemas/Project";

interface GroupProjectContextType {
  groupId: number | null;
  projectId: number | null;
  setGroupId: (id: number | null) => void;
  setProjectId: (id: number | null) => void;

  role: RoleGroup | null;
  permission: PermissionProject | null;

  setRole: (role: RoleGroup | null) => void;
  setPermission: (permission: PermissionProject | null) => void;
}

const GroupProjectContext = createContext<GroupProjectContextType | null>(null);

export function GroupProjectProvider({ children }) {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [role, setRole] = useState<RoleGroup | null>(null);
  const [permission, setPermission] = useState<PermissionProject | null>(null);

  return (
    <GroupProjectContext.Provider
      value={{
        groupId,
        projectId,
        setGroupId,
        setProjectId,
        role,
        permission,
        setRole,
        setPermission,
      }}
    >
      {children}
    </GroupProjectContext.Provider>
  );
}

export default GroupProjectContext;
