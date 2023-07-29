
import TechStack from "@/components/TechStack";

export default function About(): JSX.Element {
  return (
    <div id="about" className="mb-10">
      <h2 className="text-4xl font-extralight tracking-widest">
        about
      </h2>
      <section className="font-thin mb-5">
        Esse sunt nulla aute labore labore qui laborum ad laboris ipsum. Incididunt do cillum proident aliquip elit proident do mollit voluptate amet. Incididunt amet labore officia cupidatat id nostrud aliquip consequat elit adipisicing proident reprehenderit in reprehenderit. Irure cillum Lorem mollit aliquip minim ut aliquip aliquip laboris mollit amet nulla sunt aliquip. Pariatur eiusmod irure adipisicing esse. Nisi voluptate eu ea laborum sit irure.
      </section>
      <div id="tech">
        <h4 className=" text-3xl font-extralight tracking-widest">
          tech
        </h4>
        <TechStack />
      </div>
    </div>
  );
}
