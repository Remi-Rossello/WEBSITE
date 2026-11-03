const digitRecognizerProject = {
  id: "backend-test",
  title: "The Famous Digit AI",
  status: "Available",
  imageUrl: "/assets/images/projects/digit-recognizer.jpg",
  tags: ["Software", "AI"],
};

const dinoSkillProject = {
  id: "dino-skill",
  title: "Agent Skill: Dino Game",
  status: "Available",
  imageUrl: "/assets/images/projects/dino-skill.jpg",
  tags: ["Software", "AI"],
};

const lunarGeologyProject = {
  id: "publication-lunar-geology",
  title: "Publication: Spectral Analysis Algorithm",
  status: "Published",
  imageUrl: "/assets/images/projects/lunar-geology.jpg",
  tags: ["Publication", "Software", "Physics"],
};

export const featuredProjects = [digitRecognizerProject, dinoSkillProject, lunarGeologyProject];

export const projects = [
  digitRecognizerProject,
  dinoSkillProject,
  lunarGeologyProject,
  {
    id: "publication-spintronics",
    title: "Spintronics: Intro to DM effect",
    status: "Published",
    imageUrl: "/assets/images/projects/spintronics.jpg",
    tags: ["Publication", "Physics"],
  },
  {
    id: "publication-spectroscopy",
    title: "Spectroscopy:Raman vs FTIR",
    status: "Published",
    imageUrl: "/assets/images/projects/spectroscopy.jpg",
    tags: ["Publication", "Physics"],
  },
  {
    id: "lagrangian",
    title: "Lagrangian explorer",
    status: "In progress",
    imageUrl: "/assets/images/projects/lagrangian.jpg",
    imageCredit: "Credit: Symmetry magazine",
    tags: ["Physics", "Software"],
  },
  {
    id: "field-catalog",
    title: "Standard Model Explorer",
    status: "In progress",
    imageUrl: "/assets/images/projects/field-catalog.jpg",
    tags: ["Physics", "Software"],
  },
  {
    id: "computer-roadmap",
    title: "Guide to Computers: From Transistors to Pixels",
    status: "Upcoming",
    imageUrl: "/assets/images/projects/computer-roadmap.jpg",
    tags: ["Computers", "Education"],
  },
];
