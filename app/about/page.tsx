'use client';

import TechStack from "@/components/TechStack";
export default function About(): JSX.Element {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-light">
      <h1 className="col-span-full">
        about
      </h1>

      <div id="tech" className="my-2">
        <h4 className=" text-3xl font-light tracking-widest">tech</h4>
        <p className="font-thin text-2xl text-stone-50"></p>
        <p className="font-thin text-xl text-stone-50"></p>
        <TechStack />
      </div>
    </section>
  );
}
