"use client";
import { useContext } from "react";

import { AuthContext } from "@/src/contexts/AuthContext";

import Hero from "../components/app-landing-page/hero";
import Cards from "../components/app-landing-page/cards";
import Projects from "../components/app-landing-page/projects";
import ProjectsTest from "../components/app-landing-page/projectsTest";

export default function Home() {
  const { user } = useContext(AuthContext);

  return <div className="flex flex-col gap-10 sm:gap-28"></div>;
}
