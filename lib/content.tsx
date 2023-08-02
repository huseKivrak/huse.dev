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
  // {
  //   name: "contact",
  //   url: "/contact",
  // },
];

/** PROJECTS */
export const PROJECT_LIST: Project[] = [
  {
    title: "Warbler",
    image: "/images/projects/warbler.png",
    description: "a social media application",
    url: "https://warbler-huse.onrender.com",
    github: "https://github.com/husekivrak/warbler",
    tags: ["Flask", "PostgreSQL", "SQLAlchemy"],
  },
  {
    title: "Jobly",
    description: "a job search web application",
    image: "/images/projects/jobly.png",
    url: "https://jobly.huse.dev",
    github: "https://github.com/husekivrak/jobly",
    tags: ["Express.js", "React", "PostgreSQL"],
  },
  {
    title: "RithmGo",
    image: "/images/projects/rithmgo.jpg",
    description: "a mobile application for students",
    github: "https://github.com/husekivrak/rithmgo",
    tags: ["React Native", "TypeScript"],
  },
  {
    title: "huse.dev",
    image: "/images/projects/website.png",
    description: "my personal website",
    github: "https://github.com/husekivrak/huse.dev",
    tags: ["Next.js", "TypeScript", "Vercel", "Tailwind CSS"],
  }
];
