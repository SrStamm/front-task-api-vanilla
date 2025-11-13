import GroupCard from "./GroupCard";
import ListCard from "../../../components/common/ListCard";
import type { ReadGroup } from "../schemas/Group";

const Groups: ReadGroup[] = [
  {
    group_id: 1,
    name: "Test",
    users: [{ user_id: 1, username: "test" }],
  },
  {
    group_id: 2,
    name: "Hola",
    users: [
      { user_id: 1, username: "test" },
      { user_id: 2, username: "Adios" },
    ],
  },
];

function GroupList() {
  return (
    <ListCard
      children={Groups.map((group) => {
        return (
          <GroupCard
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
