import { useState } from "react";
import Button from "../../components/common/Button";
import GroupList from "../../features/groups/components/GroupList";
import GroupViewModal from "../../features/groups/components/GroupModal";
import { useGroups } from "../../features/groups/hooks/useGroups";
import { type ReadGroup } from "../../features/groups/schemas/Group";
import GroupCreateUpdateModal from "../../features/groups/components/GroupCreateUpdateModal.tsx";
import UserAddToGroupModal from "../../features/users/component/UserAddToGroupModal/index.tsx";
import type { ReadUser } from "../../types/User.ts";
import { fetchGetAllUsers } from "../../features/users/api/userServices.ts";
import ProjectCreateUpdateModal from "../../features/projects/components/ProjectEditModal/index.tsx";

function GroupsPage() {
  const { groups, loading, error, createGroup, deleteGroup, updateGroup } =
    useGroups();

  const [selectedGroup, setSelectedGroup] = useState<ReadGroup | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showUserAddModal, setShowUserAddModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [allUsers, setAllUsers] = useState<ReadUser[] | []>([]);
  const [typeModal, setTypeModal] = useState("");

  const handleHideCreateProjectModal = () => {
    setShowCreateProjectModal(false);
  };

  const handleShowCreateProjectModal = () => {
    setShowCreateProjectModal(true);
  };

  const handleShowUserAddModal = async () => {
    setShowUserAddModal(true);
    const users = await fetchGetAllUsers();

    const usersInGroupIDs = new Set(selectedGroup?.users.map((u) => u.user_id));

    const usersNotInGroup = users.filter((u) => {
      return !usersInGroupIDs.has(u.user_id);
    });

    setAllUsers(usersNotInGroup);
  };

  const handleHideUserAddModal = () => {
    setShowUserAddModal(false);
  };

  const handleOpenModal = (group: ReadGroup) => {
    setSelectedGroup(group);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (showUserAddModal || showCreateProjectModal) {
      return;
    }
    setOpenModal(false);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
    setTypeModal("create");
  };

  const handleOpenUpdateModal = (group: ReadGroup) => {
    setSelectedGroup(group);
    setOpenCreateModal(true);
    setTypeModal("update");
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleDeleteGroup = async (group_id: number) => {
    await deleteGroup(group_id);
    handleCloseModal();
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "black", fontSize: "1.5em" }}>Cargando los grupos</p>
      </div>
    );
  if (error) {
    console.error("Error loading groups:", error);
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "red" }}>Error al cargar los grupos</p>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>{error}</p>
      </div>
    );
  }

  return (
    <>
      <section className="dashboard-section">
        <div className="partSections">
          <div className="headerPartSection">
            <h3 className="dashboard-h3"> Grupos </h3>
            <Button
              text=" + "
              className="btn-primary"
              onClick={handleOpenCreateModal}
            />
          </div>

          {groups.length > 0 ? (
            <GroupList groups={groups} onViewGroup={handleOpenModal} />
          ) : (
            <p>No perteneces a ningún grupo</p>
          )}
        </div>
      </section>

      {selectedGroup && (
        <GroupViewModal
          open={openModal}
          onClose={handleCloseModal}
          group={selectedGroup}
          deleteGroup={handleDeleteGroup}
          onEdit={handleOpenUpdateModal}
          onAddUser={handleShowUserAddModal}
          onCreateProject={handleShowCreateProjectModal}
        />
      )}

      <GroupCreateUpdateModal
        type={typeModal}
        group={selectedGroup && selectedGroup}
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        createGroup={createGroup}
        editGroupEvent={updateGroup}
      />

      <ProjectCreateUpdateModal
        type="create"
        onClose={handleHideCreateProjectModal}
        open={showCreateProjectModal}
        groupIdCharged={selectedGroup?.group_id}
      />

      <UserAddToGroupModal
        users={allUsers}
        groupId={selectedGroup && selectedGroup.group_id}
        onClose={handleHideUserAddModal}
        show={showUserAddModal}
      />
    </>
  );
}

export default GroupsPage;
