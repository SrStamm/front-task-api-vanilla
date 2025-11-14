import { useState } from "react";
import Button from "../../components/common/Button";
import GroupList from "../../features/groups/components/GroupList";
import GroupViewModal from "../../features/groups/components/GroupModal";
import { useGroups } from "../../features/groups/hooks/useGroups";
import type { ReadGroup } from "../../features/groups/schemas/Group";

function GroupsPage() {
  const { groups, loading, error } = useGroups();

  const [selectedGroup, setSelectedGroup] = useState<ReadGroup | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (group: ReadGroup) => {
    setSelectedGroup(group);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedGroup(null);
    setOpenModal(false);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section className="dashboard-section">
        <div className="partSections">
          <div className="headerPartSection">
            <h3 className="dashboard-h3"> Grupos </h3>
            <Button text=" + " className="btn-primary" />
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
        />
      )}
    </>
  );
}

export default GroupsPage;
