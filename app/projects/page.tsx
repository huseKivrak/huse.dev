import { PROJECTS } from "@/lib/content";
import { AiOutlineGithub } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Projects(): JSX.Element {
  //
  return (
    <div className="container mt-10 px-0 mx-auto">
      <h2 className="text-4xl font-extralight mb-4">projects</h2>

      {PROJECTS.map((project, index) => (
        <div
          key={`${project.title}-${index}`}
          className="bg-transparent mb-10 p-4 border rounded-lg border-stone-100"
        >
          <div className="space-y-4 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6 lg:space-y-4">
            <AspectRatio ratio={19 / 16}>
              <Image
                className="object-cover shadow-lg rounded-lg group-hover:opacity-75"
                src={project.image}
                alt={project.title}
                fill
              />
            </AspectRatio>

            <div className="sm:col-span-2">
              <div className="mt-2">
                <h4 className="text-lg leading-6 font-semibold font-sans text-skin-inverted group-hover:text-skin-primary">
                  {project.title}
                  <Link href={project.github} target="_blank">
                    <AiOutlineGithub className="inline-block ml-2 text-xl" />
                  </Link>
                  {project.url && (
                    <Link href={project.url} target="_blank">
                      <FiExternalLink className="inline-block ml-2 text-xl" />
                    </Link>
                  )}
                </h4>

                <p className="mt-1 text-sm font-normal text-skin-base leading-5">
                  {project.description}
                </p>
                <Separator className="mb-4" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center leading-none px-1 py-1 text-xs font-medium text-stone-200 bg-stone-700 rounded-sm border border-stone-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
