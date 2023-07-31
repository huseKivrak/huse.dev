"use client";

import TechStack from "@/components/TechStack";
import Link from "next/link";

export default function About(): JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-light">
      <h1 className="col-span-full">about</h1>
      <div id="bio" className="my-2 col-span-full">
        <h4 className=" text-3xl font-light tracking-widest">bio</h4>
        <p className="font-thin text-xl text-stone-50">
          Culpa labore ipsum consectetur in in eiusmod ea.
        </p>
        <p className="font-thin text-xl text-stone-50">
          Culpa minim officia cupidatat adipisicing reprehenderit ipsum mollit.
          Qui eu id irure nisi occaecat in est. Magna voluptate et qui cillum
          magna aute Lorem ipsum id ad irure cillum. Irure dolor quis dolore
          pariatur culpa elit laborum adipisicing ipsum. Excepteur anim eu
          excepteur ipsum velit.
        </p>
        <p className="font-thin text-xl text-stone-50"></p>
      </div>
      <div id="tech" className="my-2">
        <h4 className=" text-3xl font-light tracking-widest">tech</h4>
        <TechStack />
      </div>
      <div id="resume" className="col-span-full">
        <h4 className="text-3xl font-light tracking-widest">resume</h4>
        <p className="font-thin text-xl text-stone-50">
          Culpa labore ipsum consectetur in in eiusmod ea.
        </p>
        <Link href="/pdfs/resume.pdf" target="_blank" className="flex text-lg hover:text-rose-200" download>
        download pdf
          </Link>
      </div>
    </div>
  );
}
