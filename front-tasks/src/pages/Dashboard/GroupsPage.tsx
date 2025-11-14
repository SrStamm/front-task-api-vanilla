import Button from "../../components/common/Button";
import GroupList from "../../features/groups/components/GroupList";
import { useGroups } from "../../features/groups/hooks/useGroups";

function GroupsPage() {
  const { groups, loading, error } = useGroups();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="dashboard-section">
      <div className="partSections">
        <div className="headerPartSection">
          <h3 className="dashboard-h3"> Grupos </h3>
          <Button text=" + " className="btn-primary" />
        </div>

        {groups.length > 0 ? (
          <GroupList groups={groups} />
        ) : (
          <p>No perteneces a ningún grupo</p>
        )}
      </div>
    </section>
  );
}

export default GroupsPage;
