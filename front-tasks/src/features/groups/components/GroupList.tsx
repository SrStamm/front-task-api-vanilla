import GroupCard from "./GroupCard";
import ListCard from "../../../components/common/ListCard";
import type { ReadGroup } from "../schemas/Group";

interface listProps {
  groups: ReadGroup[];
  onViewGroup?: () => void;
}

function GroupList({ groups, onViewGroup }: listProps) {
  return (
    <ListCard
      children={groups.map((group) => {
        return (
          <GroupCard key={group.group_id} group={group} onView={onViewGroup} />
        );
      })}
    />
  );
}

export default GroupList;
