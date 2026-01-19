import Card from "../../../../components/common/Card";
import { ReadProject } from "../../schemas/Project";

interface listProps {
  projects: ReadProject[];
}

function ProjectListMini({ projects }: listProps) {
  return (
    <ol className="listProject">
      {projects.map((p) => {
        return (
          <Card
            className="project-item"
            key={p.project_id}
            title={p.title}
            description={p.description}
            expand={false}
          />
        );
      })}
    </ol>
  );
}

export default ProjectListMini;
