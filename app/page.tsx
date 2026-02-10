import VoiceAgent from "@/components/VoiceAgent";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      {/* Identity */}
      <div className="text-center mb-2">
        <h1 className="text-5xl sm:text-6xl font-thin tracking-widest text-white mb-2">
          huse kivrak
        </h1>
        <p className="text-stone-500 text-sm tracking-[0.3em] uppercase font-light">
          software engineer
        </p>
      </div>

      {/* Voice Agent */}
      <VoiceAgent />

      {/* Social Links */}
      <div className="flex space-x-10 text-xl mt-8">
        <Link
          href="https://github.com/husekivrak"
          target="_blank"
          aria-label="GitHub"
        >
          <SiGithub className="text-stone-500 hover:text-stone-300 transition-colors duration-300" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/husekivrak/"
          target="_blank"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="text-stone-500 hover:text-stone-300 transition-colors duration-300" />
        </Link>
        <Link
          href="mailto:huse@husekivrak.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email"
        >
          <TbMailFilled className="text-stone-500 hover:text-stone-300 transition-colors duration-300" />
        </Link>
      </div>

      {/* Navigation to other pages */}
      <nav className="flex space-x-8 mt-2">
        <Link
          href="/projects"
          className="text-xs tracking-[0.2em] text-stone-600 hover:text-stone-400 transition-colors duration-300 uppercase"
        >
          projects
        </Link>
        <Link
          href="/blog"
          className="text-xs tracking-[0.2em] text-stone-600 hover:text-stone-400 transition-colors duration-300 uppercase"
        >
          blog
        </Link>
      </nav>
    </div>
  );
}
