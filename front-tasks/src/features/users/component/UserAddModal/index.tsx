import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { UserInGroup } from "../../../groups/schemas/Group";
import type {
  AddRemoveUserToProject,
  ReadProject,
} from "../../../projects/schemas/Project";
import UserListGroup from "../UserListGroup";

interface userAddModalProps {
  show: boolean;
  onClose: () => void;
  usersInGroup: UserInGroup[];
  project: ReadProject;
  onAddUser: (data: AddRemoveUserToProject) => void;
}

function UserAddModal({
  show,
  onClose,
  usersInGroup,
  project,
  onAddUser,
}: userAddModalProps) {
  const handleAddUserToProject = async (userId: number) => {
    onAddUser({
      group_id: project.group_id,
      project_id: project.project_id,
      user_id: userId,
    });
    onClose();
  };

  const header = <h2 className="modal-title-center">Lista de usuarios</h2>;
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
      onClose={onClose}
      showModal={show}
      modalHeader={header}
      modalBody={body}
      modalActions={actions}
      size="med"
    />
  );
}

export default UserAddModal;
