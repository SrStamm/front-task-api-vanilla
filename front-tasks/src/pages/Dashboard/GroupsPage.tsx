import { useState } from "react";
import Button from "../../components/common/Button";
import GroupList from "../../features/groups/components/GroupList";
import GroupViewModal from "../../features/groups/components/GroupModal";
import { useGroups } from "../../features/groups/hooks/useGroups";
import type { ReadGroup } from "../../features/groups/schemas/Group";
import GroupCreateUpdateModal from "../../features/groups/components/GroupCreateUpdateModal.tsx";

function GroupsPage() {
  const { groups, loading, error, createGroup, deleteGroup, updateGroup } =
    useGroups();

  const [selectedGroup, setSelectedGroup] = useState<ReadGroup | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");

  const handleOpenModal = (group: ReadGroup) => {
    setSelectedGroup(group);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedGroup(null);
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

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
    </>
  );
}

export default GroupsPage;
