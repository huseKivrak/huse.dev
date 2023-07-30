"use client";

//todo: check next.js tree shaking
import * as Icons from "react-icons/si";
import { Tech } from "@/lib/types";

/** TECH STACK */
export const TECHS: Tech[] = [
  // { title: "HTML", Icon: Icons.SiHtml5, color: "text-orange-500" },
  // { title: "CSS", Icon: Icons.SiCss3, color: "text-blue-400" },
  // { title: "Bootstrap", Icon: Icons.SiBootstrap, color: "text-purple-600" },
  { title: "JavaScript", Icon: Icons.SiJavascript, color: "text-yellow-300" },
  { title: "TypeScript", Icon: Icons.SiTypescript, color: "text-blue-600" },
  { title: "Python", Icon: Icons.SiPython, color: "text-blue-300" },
  { title: "Tailwind CSS", Icon: Icons.SiTailwindcss, color: "text-teal-500" },
  { title: "React", Icon: Icons.SiReact, color: "text-blue-300" },
  { title: "Node.js", Icon: Icons.SiNodedotjs, color: "text-green-400" },
  { title: "Express", Icon: Icons.SiExpress, color: "text-black" },
  { title: "Django", Icon: Icons.SiDjango, color: "text-green-700" },
  { title: "Flask", Icon: Icons.SiFlask, color: "text-black" },
  { title: "PostgreSQL", Icon: Icons.SiPostgresql, color: "text-blue-700" },
  { title: "Next.js", Icon: Icons.SiNextdotjs, color: "text-black" },
  { title: "Vercel", Icon: Icons.SiVercel, color: "text-black" },
];

export default function TechStack() {
  return (
    <div
      id="icons"
      className="grid grid-cols-4 gap-y-5 gap-x-12 max-w-fit p-2 rounded-md"
    >
      {TECHS.map((tech) => (
        <tech.Icon
          key={tech.title}
          className={`text-3xl ${tech.color} opacity-80 hover:opacity-100`}
        />
      ))}
    </div>
  );
}
