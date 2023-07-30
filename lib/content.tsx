import { Project } from "./types";

/** NAV LINKS */
export const NAV_LINKS = [
  {
    name: "about",
    url: "/about",
  },

  {
    name: "projects",
    url: "/projects",
  },
  {
    name: "blog",
    url: "/blog",
  },
  {
    name: "contact",
    url: "/contact",
  },
];

/** PROJECTS */
export const PROJECTS: Project[] = [
  {
    title: "Jobly",
    description: "a full stack job search web application",
    image: "/images/projects/jobly.png",
    url: "https://jobly.huse.dev",
    github: "https://github.com/husekivrak/jobly",
    tags: ["Express.js", "React", "PostgreSQL"],
  },
  {
    title: "Warbler",
    image: "/images/projects/warbler.png",
    description: "a social media app",
    url: "https://warbler-huse.onrender.com",
    github: "https://github.com/husekivrak/warbler",
    tags: ["Flask", "PostgreSQL", "SQLAlchemy"],
  },
  {
    title: "RithmGo",
    image: "/images/projects/rithmgo.jpg",
    description: "a mobile app for students",
    github: "https://github.com/husekivrak/rithmgo",
    tags: ["React Native", "TypeScript"],
  },
];
