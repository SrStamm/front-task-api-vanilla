import Card from "../../../components/common/Card";
import type { ReadGroup } from "../schemas/Group";

interface GroupCardProps {
  group: ReadGroup;
  onView?: (group: ReadGroup) => void;
}

function GroupCard({ group, onView }: GroupCardProps) {
  return (
    <Card
      title={group.name}
      description={`Miembros: ${group.users.length}`}
      details={<span>ID: {group.group_id}</span>}
      action={{
        text: "Ver más detalles",
        className: "btn-sm btn-outline-primary btn-manage",
        onClick: () => onView?.(group),
      }}
    />
  );
}

export default GroupCard;
