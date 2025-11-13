import GroupCard from "./GroupCard";
import ListCard from "../../../components/common/ListCard";
import type { ReadGroup } from "../schemas/Group";

interface listProps {
  groups: ReadGroup[];
}

function GroupList({ groups }: listProps) {
  return (
    <ListCard
      children={groups.map((group) => {
        return (
          <GroupCard
            key={group.group_id}
            group_id={group.group_id}
            name={group.name}
            users={group.users}
          />
        );
      })}
    />
  );
}

export default GroupList;
