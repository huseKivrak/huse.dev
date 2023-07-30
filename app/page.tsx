import TechStack from "@/components/TechStack";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

export default function App() {
  return (
    <div>
      <div className="my-10">
        <h1 className="text-5xl font-thin my-0.5">
          huse kivrak
        </h1>
        <h2 className="font-thin">software engineer</h2>
        <div className="flex space-x-4 mt-2 text-3xl">
          <a href="https://github.com/husekivrak" target="_blank">
            <SiGithub className=" text-black" />
          </a>
          <a href="https://www.linkedin.com/in/husekivrak/" target="_blank">
            <FaLinkedin className=" text-blue-500" />
          </a>
        </div>
      </div>

      <section id="about">
        <h2>about</h2>
        <section className="font-thin mb-5 text-xl tracking-widest leading-loose">
          Esse sunt nulla aute labore labore qui laborum ad laboris ipsum.
          Incididunt do cillum proident aliquip elit proident do mollit
          voluptate amet. Incididunt amet labore officia cupidatat id nostrud
          aliquip consequat elit adipisicing proident reprehenderit in
          reprehenderit. Irure cillum Lorem mollit aliquip minim ut aliquip
          aliquip laboris mollit amet nulla sunt aliquip. Pariatur eiusmod irure
          adipisicing esse. Nisi voluptate eu ea laborum sit irure.
        </section>
        <div id="tech" className="my-2">
          <h4 className=" text-3xl font-extralight tracking-widest">tech</h4>
        </div>
      </section>
      <TechStack />
      <footer className=" fixed inset-x-0 bottom-0 p-4 text-center font-light ">
        <p className="text-white text-xl">©2023 huse kivrak</p>
      </footer>
    </div>
  );
}
