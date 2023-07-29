import { IconContext } from "react-icons";
import TechStack from "@/components/TechStack";

export default function About(): JSX.Element {
  return (
    <div id="about">
      <h2 className="text-stone-100 text-4xl font-extralight tracking-widest">
        about
      </h2>
      <div id="tech">
        <h4 className="text-stone-100 text-3xl font-extralight tracking-widest">
          tech
        </h4>
        <TechStack />
      </div>
    </div>
  );
}
