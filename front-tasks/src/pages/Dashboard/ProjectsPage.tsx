import Button from "../../components/common/Button";
import { useProjects } from "../../features/projects/hooks/useProject";
import ProjectList from "../../features/projects/components/ProjectList";
import { useState } from "react";
import type { ReadProject } from "../../features/projects/schemas/Project";
import ProjectModal from "../../features/projects/components/ProjectModal";
import ProjectCreateUpdateModal from "../../features/projects/components/ProjectEditModal";
import UserAddModal from "../../features/users/component/UserAddModal";
import type { UserInGroup } from "../../features/groups/schemas/Group";
import { useGroups } from "../../features/groups/hooks/useGroups";
import { useGroupProject } from "../../hooks/useGroupProject";
import ErrorContainer from "../../components/common/ErrorContainer";

function ProjectsPage() {
  const {
    projects,
    loading,
    error,
    deleteProject,
    createProject,
    updateProject,
    addUserToProject,
    removeUserFromProject,
  } = useProjects();
  const { getUsersInGroup } = useGroups();
  const { groupId, role } = useGroupProject();

  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [usersInGroup, setUsersInGroup] = useState<UserInGroup[]>([]);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProject, setSelectedProject] = useState<ReadProject | null>(
    null,
  );

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "black", fontSize: "1.5em" }}>
          Cargando los proyectos
        </p>
      </div>
    );

  if (!groupId) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "red", fontSize: "1.3rem" }}>
          No hay ningún grupo seleccionado
        </p>
        <p style={{ color: "#666", fontSize: "1rem", marginTop: "0.5rem" }}>
          Seleccione un grupo en
          <span style={{ color: "black" }}> 'Grupo ▼'</span>
        </p>
      </div>
    );
  }

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "red" }}>Error al cargar los proyectos</p>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>{error}</p>
      </div>
    );

  const currentProject = projects?.find(
    (p) => p.project_id === selectedProject?.project_id,
  );

  const handleOpenModal = (project: ReadProject) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (showUserModal || openCreateModal) {
      return;
    }
    setOpenModal(false);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
    setTypeModal("create");
  };

  const handleOpenUpdateModal = (project: ReadProject) => {
    setSelectedProject(project);
    setOpenCreateModal(true);
    setTypeModal("update");
  };

  const handleDeleteProject = async (groupId: number, projectId: number) => {
    await deleteProject(groupId, projectId);
    handleCloseModal();
  };

  const handleOpenUserModal = async () => {
    const usersInGroup = await getUsersInGroup(selectedProject?.group_id);

    const usersInProjectIds = new Set(
      selectedProject?.users.map((u) => u.user_id),
    );

    const usersNotInProject = usersInGroup.filter((u) => {
      return !usersInProjectIds.has(u.user_id);
    });

    setShowUserModal(true);
    setUsersInGroup(usersNotInProject);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
  };

  return (
    <>
      <section className="dashboard-section">
        <div className="partSections">
          <div className="headerPartSection">
            <h3 className="dashboard-h3"> Proyectos </h3>
            {role === "admin" ? (
              <Button
                text=" + "
                className="btn-primary"
                onClick={handleOpenCreateModal}
              />
            ) : (
              ""
            )}
          </div>

          {projects && projects.length > 0 ? (
            <ProjectList projects={projects} onViewProject={handleOpenModal} />
          ) : (
            <ErrorContainer
              advice="No hay tareas en este proyecto"
              recommendation="Crea tu primera tarea haciendo click en el boton '+'"
              isButton={false}
              isError={false}
            />
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          open={openModal}
          onClose={handleCloseModal}
          project={currentProject || selectedProject}
          deleteProject={handleDeleteProject}
          onEdit={handleOpenUpdateModal}
          onDelete={removeUserFromProject}
          onShowListUser={handleOpenUserModal}
        />
      )}

      <ProjectCreateUpdateModal
        type={typeModal}
        project={selectedProject && selectedProject}
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={createProject}
        onUpdate={updateProject}
      />

      {showUserModal && selectedProject && (
        <UserAddModal
          show={showUserModal}
          onClose={handleCloseUserModal}
          usersInGroup={usersInGroup}
          project={selectedProject}
          onAddUser={addUserToProject}
        />
      )}
    </>
  );
}

export default ProjectsPage;
