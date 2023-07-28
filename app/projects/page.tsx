"use client";

import { PROJECTS } from "@/lib/content";
import { AiOutlineGithub } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Image from "next/image";

export default function Projects(): JSX.Element {
  return (
    <section id="projects" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <h2 className="text-stone-100 text-4xl font-extralight tracking-widest col-span-full">projects</h2>
      {PROJECTS.map((project, index) => (
        <Card
          className="py-4 bg-stone-700 border border-stone-400 text-stone-200"
          key={`${project.title}-${index}`}
          tabIndex={0}
        >
          <CardHeader className="py-0 px-5 flex justify-between items-start text-lg">
            <div>{project.title}</div>
            <div className="flex space-x-4 text-2xl hover:text-white">
              <Link href={project.github} aria-label={`GitHub link for ${project.title}`}>
                <AiOutlineGithub />
              </Link>
              {project.url && (
                <Link href={project.url} aria-label={`External link for ${project.title}`}>
                  <FiExternalLink />
                </Link>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col py-2">
            {project.description}
            <Divider />
            <Image
              src={project.image}
              alt={project.title}
              width={400}
              height={200}
              className="mt-2"
            />
            <Divider />
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-evenly flex-wrap">
            {project.tags.map((tag, index) => {
              return (
                <span
                  key={index}
                  className="inline-flex items-center bg-stone-600 text-stone-100 text-sm font-light px-2 py-1"
                >
                  {tag}
                </span>
              );
            })}
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
