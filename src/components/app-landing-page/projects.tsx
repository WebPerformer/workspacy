import React, { useRef } from "react";
import Image from "next/image";
import { Figtree } from "next/font/google";
import LocalFont from "next/font/local";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const seriously = LocalFont({
  src: "../../../public/fonts/SeriouslyNostalgicFnIt-Reg.otf",
  display: "swap",
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

import images from "@/src/data/images";

export default function Projects() {
  const mainContainer = useRef<HTMLDivElement>(null);
  const projectsContainer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let split = SplitText.create("#heading", { type: "words" });

    gsap.from(".projects", {
      scale: 0,
      stagger: 0.3,
      scrollTrigger: {
        trigger: projectsContainer.current,
        start: "center bottom",
        end: "bottom center",
        scrub: true,
      },
    });

    gsap.to(".projects-container", {
      width: "25%",
      scrollTrigger: {
        trigger: mainContainer.current,
        start: "center bottom",
        end: "70% bottom",
        scrub: true,
      },
    });

    gsap.to(".main-projects-container", {
      y: "-50%",
      scrollTrigger: {
        trigger: projectsContainer.current,
        start: "start center",
        end: "bottom center",
        scrub: true,
      },
    });

    gsap.from(split.words, {
      y: 20,
      autoAlpha: 0,
      stagger: 0.05,
      filter: "blur(10px)",
      scrollTrigger: {
        trigger: mainContainer.current,
        start: "67% bottom",
        end: "bottom bottom",
        scrub: true,
      },
    });
  });

  return (
    <div
      ref={mainContainer}
      className="flex flex-col items-center gap-10 h-[200vh]"
    >
      <div className="flex flex-col items-center gap-6">
        <p className="text-muted-foreground">Benefits of begin our client</p>
        <h1
          className={`text-6xl ${figtree.className} font-medium max-w-[750px] text-center`}
        >
          Let's{" "}
          <span className={`${seriously.className} font-normal`}>
            take a look
          </span>{" "}
          at some of our{" "}
          <span className={`${seriously.className} font-normal`}>
            creative projects
          </span>
        </h1>
      </div>
      <div className="main-projects-container sticky top-[50%]">
        <div
          ref={projectsContainer}
          className="projects-container relative aspect-video overflow-hidden"
        >
          <Image
            src={images.projects.project_1}
            alt=""
            className="object-cover"
          />
          <Image
            src={images.projects.project_2}
            alt=""
            className="projects absolute w-full h-full top-0 left-0 object-cover"
          />
          <Image
            src={images.projects.project_3}
            alt=""
            className="projects absolute w-full h-full top-0 left-0 object-cover"
          />
          <Image
            src={images.projects.project_4}
            alt=""
            className="projects absolute w-full h-full top-0 left-0 object-cover"
          />
          <Image
            src={images.projects.project_5}
            alt=""
            className="projects absolute w-full h-full top-0 left-0 object-cover"
          />
        </div>
        <h1
          id="heading"
          className={`projects-text text-5xl -mt-7 ${figtree.className}`}
        >
          <span className="spacer">&nbsp;</span>
          From day one, the mission has been clear: deliver top-tier digital
          solutions from design to code.
        </h1>
      </div>
    </div>
  );
}
