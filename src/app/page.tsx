"use client";
import { useContext } from "react";

import { AuthContext } from "@/src/contexts/AuthContext";

import Hero from "../components/app-landing-page/hero";
import Cards from "../components/app-landing-page/cards";
import Projects from "../components/app-landing-page/projects";
import ProjectsTest from "../components/app-landing-page/projectsTest";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-10 sm:gap-28">
      <Hero />
      <Cards />
      <div className="max-w-3/4 mx-auto p-16 border border-dashed rounded-lg">
        <p className="text-lg text-center font-medium">
          From day one, the mission has been clear: deliver top-tier digital
          solutions — from design to code. Unlike traditional agencies, there
          are no handoffs between teams here. Every part of the project is
          handled by a single person, ensuring consistency, speed, and obsessive
          attention to detail.
        </p>
      </div>
      <ProjectsTest />
      <div className="flex justify-end h-screen">
        <p className="w-1/2 text-muted-foreground">
          From day one, the mission has been clear: deliver top-tier digital
          solutions — from design to code. Unlike traditional agencies, there
          are no handoffs between teams here. Every part of the project is
          handled by a single person, ensuring consistency, speed, and obsessive
          attention to detail.
        </p>
      </div>
    </div>
  );
}
