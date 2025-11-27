import { createContext, useState } from "react";

interface GroupProjectContextType {
  groupId: number | null;
  projectId: number | null;
  setGroupId: (id: number | null) => void;
  setProjectId: (id: number | null) => void;
}

const GroupProjectContext = createContext<GroupProjectContextType | null>(null);

export function GroupProjectProvider({ children }) {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  return (
    <GroupProjectContext.Provider
      value={{ groupId, projectId, setGroupId, setProjectId }}
    >
      {children}
    </GroupProjectContext.Provider>
  );
}

export default GroupProjectContext;
