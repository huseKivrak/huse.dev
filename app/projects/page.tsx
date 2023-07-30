import { PROJECTS } from "@/lib/content";
import { AiOutlineGithub } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";

export default function Projects(): JSX.Element {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-light">
      <h2 className=" text-4xl font-extralight tracking-widest col-span-full">
        projects
      </h2>
      {PROJECTS.map((project, index) => (
        <div
          className=" bg-transparent border border-stone-300 text-stone-200 hover:text-white mx-auto px-5 "
          key={`${project.title}-${index}`}
          tabIndex={0}
        >
          <div className="flex items-start space-x-4 my-2 tracking-widest font-light text-lg">
            <p className="ml-2">{project.title}</p>

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
            <div className="space-x-4 ml-2 my-1">
              {project.tags.map((tag, index) => {
                return (
                  <span key={index} className="">
                    {tag}
                  </span>
                );
              })}
            </div>
          <Separator />

          <div className="text-sm">
            {project.description}

            <Image
              src={project.image}
              alt={project.title}
              width={400}
              height={200}
              className="mt-2"
            />
            <Separator />
          </div>
        </div>
      ))}
    </section>
  );
}
