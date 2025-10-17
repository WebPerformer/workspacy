import React, { useRef } from "react";
import Image from "next/image";
import { Figtree } from "next/font/google";
import LocalFont from "next/font/local";

import { Badge } from "../../components/ui/badge";

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

export default function projectsTest() {
  const projectsContainer = useRef<HTMLDivElement>(null);
  const textsContainer = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    let split = SplitText.create(headingRef.current, { type: "words" });
    const heading = headingRef.current;
    let lineHeight = 0;

    if (heading) {
      const computed = window.getComputedStyle(heading);
      const lineHeightStr = computed.lineHeight;
      lineHeight = parseFloat(lineHeightStr);
    }

    gsap.to(".projects", {
      y: () => window.innerHeight * 0.5 + lineHeight - 10,
      scale: 0.25,
      transformOrigin: "0% 100%",
      scrollTrigger: {
        trigger: projectsContainer.current,
        start: "bottom+=150px bottom",
        endTrigger: textsContainer.current,
        end: "bottom+=150px bottom",
        scrub: true,
      },
    });

    gsap.from(".projects-images", {
      scale: 0,
      stagger: 0.5,
      scrollTrigger: {
        trigger: projectsContainer.current,
        start: "center bottom",
        endTrigger: textsContainer.current,
        end: "top bottom",
        scrub: true,
      },
    });

    gsap.from(split.words, {
      y: 20,
      autoAlpha: 0,
      stagger: 0.05,
      filter: "blur(10px)",
      scrollTrigger: {
        trigger: textsContainer.current,
        start: "bottom bottom",
        end: "bottom center",
        scrub: true,
        markers: true,
      },
    });
  });

  return (
    <div className="flex flex-col items-center gap-10">
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
      <div>
        <section ref={projectsContainer}>
          <div className="projects relative">
            <Image
              src={images.projects.project_1}
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
            <Image
              src={images.projects.project_2}
              alt=""
              className="projects-images absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
            <Image
              src={images.projects.project_3}
              alt=""
              className="projects-images absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
            <Image
              src={images.projects.project_4}
              alt=""
              className="projects-images absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
            <Image
              src={images.projects.project_5}
              alt=""
              className="projects-images absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
          </div>
        </section>
        <section ref={textsContainer} className="mt-[50vh]">
          <h1
            ref={headingRef}
            id="heading"
            className={`projects-text text-5xl ${figtree.className}`}
          >
            <span className="spacer">&nbsp;</span>
            From day one, the mission has been clear: deliver top-tier digital
            solutions from design to code.
          </h1>
        </section>
      </div>
    </div>
  );
}
