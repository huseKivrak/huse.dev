import { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    title: "Jobly",
    description: "a full stack job search web application",
    image: "/images/jobly.png",
    url: "https://jobly.huse.dev",
    github: "https://github.com/husekivrak/jobly",
    tags: ["Express.js", "React", "PostgreSQL"],
  },
  {
    title: "Warbler",
    image: "/images/warbler.png",
    description: "a social media app",
    url: "https://warbler-huse.onrender.com",
    github: "https://github.com/husekivrak/warbler",
    tags: ["Flask", "PostgreSQL", "SQLAlchemy"],
  },
  {
    title: "RithmGo",
    image: "/images/rithmgo.jpg",
    description: "a mobile app for students",
    github: "https://github.com/husekivrak/rithmgo",
    tags: ["React Native", "TypeScript"],
  },
];

export const NAV_LINKS = [
    {
        name: 'about',
        url: "#about",
    },
    {
        name: 'projects',
        url: "#projects",
    }
]