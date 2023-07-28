import { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    title: "Jobly",
    description: "A full stack job search web application",
    image: "/images/jobly.png",
    url: "https://jobly.huse.dev",
    github: "https://github.com/husekivrak/jobly",
    tags: ["Express.js", "React", "PostgreSQL"],
  },
  {
    title: "Warbler",
    image: "/images/warbler.png",
    description: "A Twitter clone",
    url: "https://warbler-huse.onrender.com",
    github: "https://github.com/husekivrak/warbler",
    tags: ["Flask", "PostgreSQL", "SQLAlchemy"],
  },
  {
    title: "RithmGo",
    image: "/images/rithmgo.jpg",
    description: "A full stack web application for learning Go",
    github: "https://github.com/husekivrak/rithmgo",
    tags: ["React Native", "TypeScript"],
  },
];
