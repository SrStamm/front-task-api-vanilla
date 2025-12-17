import ListCard from "../../../components/common/ListCard";
import type { ReadProject } from "../schemas/Project";
import ProjectCard from "./ProjectCard";

interface listProps {
  projects: ReadProject[];
  onViewProject?: (project: ReadProject) => void;
}

function ProjectList({ projects, onViewProject }: listProps) {
  return (
    <ListCard
      children={projects.map((p) => {
        return (
          <ProjectCard key={p.project_id} project={p} onView={onViewProject} />
        );
      })}
    />
  );
}

export default ProjectList;
