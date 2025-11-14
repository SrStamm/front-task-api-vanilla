import Card from "../../../components/common/Card";
import type { ReadGroup } from "../schemas/Group";

function GroupCard(group: ReadGroup) {
  return (
    <Card
      title={group.name}
      description={`Miembros: ${group.users.length}`}
      details={<span>ID: {group.group_id}</span>}
      action={{
        text: "Ver más detalles",
        className: "btn-sm btn-outline-primary btn-manage",
      }}
    />
  );
}

export default GroupCard;
