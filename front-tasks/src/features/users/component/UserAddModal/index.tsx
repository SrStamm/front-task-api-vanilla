import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import Modal from "../../../../components/common/Modal";
import type { UserInGroup } from "../../../groups/schemas/Group";
import type {
  AddRemoveUserToProject,
  ReadProject,
} from "../../../projects/schemas/Project";
import UserListGroup from "../UserListGroup";
import ErrorContainer from "../../../../components/common/ErrorContainer";
import { getApiErrorMessage } from "../../../../utils/errors";

interface userAddModalProps {
  show: boolean;
  onClose: () => void;
  usersInGroup: UserInGroup[];
  project: ReadProject;
  onAddUser: (data: AddRemoveUserToProject) => Promise<void>;
  loadError?: string | null;
}

function UserAddModal({
  show,
  onClose,
  usersInGroup,
  project,
  onAddUser,
  loadError,
}: userAddModalProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [show]);

  const handleAddUserToProject = async (userId: number) => {
    setError(null);

    try {
      await onAddUser({
        group_id: project.group_id,
        project_id: project.project_id,
        user_id: userId,
      });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const header = (
    <div>
      <h2 className="modal-title-center">Lista de usuarios</h2>
      {error && <p className="form-error">{error}</p>}
    </div>
  );

  const body = loadError ? (
    <ErrorContainer
      advice="Error al cargar los usuarios"
      recommendation={loadError}
      isButton={false}
      isError={true}
    />
  ) : (
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
