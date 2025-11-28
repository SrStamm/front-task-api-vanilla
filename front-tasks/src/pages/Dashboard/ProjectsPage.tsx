import Button from "../../components/common/Button";
import { useProjects } from "../../features/projects/hooks/useProject";
import ProjectList from "../../features/projects/components/ProjectList";
import { useState } from "react";
import type { ReadProject } from "../../features/projects/schemas/Project";
import ProjectModal from "../../features/projects/components/ProjectModal";

function ProjectsPage() {
  const { projects, loading, error } = useProjects();
  const [openModal, setOpenModal] = useState(false);
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

  return (
    <>
      <section className="dashboard-section">
        <div className="partSections">
          <div className="headerPartSection">
            <h3 className="dashboard-h3"> Proyectos </h3>
            <Button text=" + " className="btn-primary" />
          </div>

          {projects.length > 0 ? (
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
          // deleteGroup={handleDeleteGroup}
          // onEdit={handleOpenUpdateModal}
        />
      )}
    </>
  );
}

export default ProjectsPage;
