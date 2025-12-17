import { useContext } from "react";
import GroupProjectContext from "../providers/GroupProjectProvider";

export function useGroupProject() {
  const ctx = useContext(GroupProjectContext);
  if (!ctx) {
    throw new Error("useGroupProject debe usarse dentro del provider");
  }
  return ctx;
}
