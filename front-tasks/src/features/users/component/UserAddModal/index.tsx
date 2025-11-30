import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { UserInGroup } from "../../../groups/schemas/Group";
import { useProjects } from "../../../projects/hooks/useProject";
import type { ReadProject } from "../../../projects/schemas/Project";
import UserListGroup from "../UserListGroup";

interface userAddModalProps {
  show: boolean;
  onClose: () => void;
  usersInGroup: UserInGroup[];
  project: ReadProject;
}

function UserAddModal({
  show,
  onClose,
  usersInGroup,
  project,
}: userAddModalProps) {
  const { addUserToProject } = useProjects();

  const handleAddUserToProject = async (userId: number) => {
    await addUserToProject(project.group_id, project.project_id, userId);
  };

  const header = <h2>Lista de usuarios</h2>;
  const body = (
    <UserListGroup
      users={usersInGroup}
      addUser={true}
      onAdd={handleAddUserToProject}
    />
  );
  const actions = (
    <>
      <Button text="cancelar" className="btn-primary" onClick={onClose} />
    </>
  );

  return (
    <Modal
      showModal={show}
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
      size="med"
    />
  );
}

export default UserAddModal;
