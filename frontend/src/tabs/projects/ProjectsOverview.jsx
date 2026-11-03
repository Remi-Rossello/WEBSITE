import { projects } from "./projectSections";

function ProjectsOverview({ onSelectProject }) {
  return (
    <>
      <h1 className="content-title">Projects</h1>
      <div className="projects-grid" aria-label="All projects">
        {projects.map((project) => (
          <button
            className="certification-card-button project-card"
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project.id)}
            style={{
              "--project-image": `url(${project.imageUrl})`,
            }}
          >
            <span className="project-card-frame">
              <span className="project-card-image" aria-hidden="true" />
              {project.imageCredit && <span className="project-card-credit">{project.imageCredit}</span>}
            </span>
            <span className="project-card-status">{project.status}</span>
            <h2 className="certification-title project-card-title">{project.title}</h2>
            <span className="project-card-tags">
              {project.tags.map((tag) => <span className="project-card-tag" key={tag}>{tag}</span>)}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

export default ProjectsOverview;
