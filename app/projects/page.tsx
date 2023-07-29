"use client";

import { PROJECTS } from "@/lib/content";
import { AiOutlineGithub } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Projects(): JSX.Element {
  return (
    <section
      id="projects"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-light"
    >
      <h2 className=" text-4xl font-extralight tracking-widest col-span-full">
        projects
      </h2>
      {PROJECTS.map((project, index) => (
        <Card
          className="py-4 bg-transparent border border-stone-300 text-stone-200"
          key={`${project.title}-${index}`}
          tabIndex={0}
        >
          <CardHeader className="py-0 mb-2 px-5">
            <CardTitle className="tracking-widest font-light text-lg">
              {project.title}
            </CardTitle>
            <div className="flex justify-end space-x-4 text-2xl hover:text-stone-300">
              <Link
                href={project.github}
                aria-label={`GitHub link for ${project.title}`}
              >
                <AiOutlineGithub />
              </Link>
              {project.url && (
                <Link
                  href={project.url}
                  aria-label={`External link for ${project.title}`}
                >
                  <FiExternalLink />
                </Link>
              )}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col py-2">
            {project.description}
            <Separator />
            <Image
              src={project.image}
              alt={project.title}
              width={400}
              height={200}
              className="mt-2"
            />
            <Separator />
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-evenly flex-wrap items-center py-0 my-0">
            {project.tags.map((tag, index) => {
              return (
                <span
                  key={index}
                  className="inline-flex items-center border text-sm font-light px-1 py-0.5 mt-2"
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
