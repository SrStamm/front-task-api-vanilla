import Button from "../../components/common/Button";
import { useProjects } from "../../features/projects/hooks/useProject";
import ProjectList from "../../features/projects/components/ProjectList";
import { useState } from "react";
import type { ReadProject } from "../../features/projects/schemas/Project";
import ProjectModal from "../../features/projects/components/ProjectModal";
import ProjectCreateUpdateModal from "../../features/projects/components/ProjectEditModal";

function ProjectsPage() {
  const { projects, loading, error, deleteProject } = useProjects();
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedProject, setSelectedProject] = useState<ReadProject | null>(
    null,
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const handleOpenModal = (project: ReadProject) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
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

  return (
    <>
      <section className="dashboard-section">
        <div className="partSections">
          <div className="headerPartSection">
            <h3 className="dashboard-h3"> Proyectos </h3>
            <Button
              text=" + "
              className="btn-primary"
              onClick={handleOpenCreateModal}
            />
          </div>

          {projects && projects.length > 0 ? (
            <ProjectList projects={projects} onViewProject={handleOpenModal} />
          ) : (
            <p>No perteneces a ningún proyecto</p>
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          open={openModal}
          onClose={handleCloseModal}
          project={selectedProject}
          deleteProject={handleDeleteProject}
          onEdit={handleOpenUpdateModal}
        />
      )}

      <ProjectCreateUpdateModal
        type={typeModal}
        project={selectedProject && selectedProject}
        open={openCreateModal}
        onClose={handleCloseCreateModal}
      />
    </>
  );
}

export default ProjectsPage;
