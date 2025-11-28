import Card from "../../../components/common/Card";
import type { ReadProject } from "../schemas/Project";

interface ProjectCardProps {
  project: ReadProject;
  onView?: (project: ReadProject) => void;
}

function ProjectCard({ project, onView }: ProjectCardProps) {
  return (
    <Card
      title={project.title}
      description={project.description && project.description}
      action={{
        text: "Ver más detalles",
        className: "btn-sm btn-outline-primary btn-manage",
        onClick: () => onView?.(project),
      }}
    />
  );
}

export default ProjectCard;
