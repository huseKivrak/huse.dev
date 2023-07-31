import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import Link from "next/link";

export default function App() {
  return (
    <div>
      <div className="mb-10 text-2xl font-thin">
        <h1 className="mb-0.5">huse kivrak</h1>
        <h2 className="font-thin tracking-widest text-white mb-2">
          software engineer
        </h2>
        <div className="flex space-x-12 text-3xl">
          <Link href="https://github.com/husekivrak" target="_blank">
            <SiGithub className=" text-white hover:bg-stone-700 rounded-full hover:text-black" />
          </Link>
          <Link href="https://www.linkedin.com/in/husekivrak/" target="_blank">
            <FaLinkedin className="text-white hover:text-blue-500" />
          </Link>
          <Link
            href="mailto:huse@husekivrak.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-100/80 "
          >
            <TbMailFilled className="text-white hover:text-rose-300" />
          </Link>
        </div>
        <div className="text-3xl tracking-normal mt-16 text-stone-50">
          <p className="mt-6">
            I&apos;m a career changer who followed his passions.
          </p>

          <Link
            href="/about"
            className="text-2xl text-stone-200/80 hover:text-white"
          >
            learn more
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-3xl font-thin tracking-widest text-stone-50">
            ...don&apos;t read enough blogs?
          </h3>
          <Link
            href="/blog"
            className=" text-2xl text-stone-200/80 hover:text-white"
          >
            add mine to the pile
          </Link>
        </div>
      </div>


    </div>
  );
}
