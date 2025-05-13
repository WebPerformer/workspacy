import Image from "next/image";
import { useState, useEffect } from "react";
import { Link, Plus, Zap } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { projects } from "@/data/projects";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@radix-ui/react-label";

function AppQuickAccess() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const allProjects = projects.projectsMain[0].items;
  const MAX_PROJECTS = 3;

  useEffect(() => {
    if (selectedProjects.length === 0 && allProjects.length > 0) {
      const initialProjects = allProjects
        .slice(0, Math.min(MAX_PROJECTS, allProjects.length))
        .map((project) => project.title);
      setSelectedProjects(initialProjects);
    }
  }, []);

  const filteredProjects = allProjects.filter((project) =>
    selectedProjects.includes(project.title)
  );

  const [open, setOpen] = useState(false);

  const handleProjectToggle = (projectTitle: string) => {
    setSelectedProjects((prev) => {
      if (prev.includes(projectTitle)) {
        return prev.filter((title) => title !== projectTitle);
      } else {
        if (prev.length >= MAX_PROJECTS) {
          return prev;
        }
        return [...prev, projectTitle];
      }
    });
  };

  return (
    <section>
      <div className="flex flex-col gap-4 @container">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-accent" />
            <h1 className="text-lg sm:text-xl font-medium">Quick Access</h1>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="w-full text-accent hover:text-foreground bg-transparent hover:bg-secondary/50"
                onClick={() => setOpen(true)}
              >
                <Plus />
                <p className="hidden @[275px]:block">Add Project </p>
              </Button>
            </div>
          </div>
        </div>
        <Carousel>
          <CarouselContent className="@container -ml-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, id) => (
                <CarouselItem
                  key={id}
                  className="pl-2 basis-7/8 @[600px]:basis-3/7 @[1040px]:basis-1/3"
                >
                  <div className="relative aspect-video rounded-md bg-muted border overflow-clip">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 w-full flex items-center gap-2 bg-background px-4 py-2 text-sm">
                      <project.icon size={16} />
                      {project.title}
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="pl-2 basis-full">
                <div className="flex items-center justify-center p-8 rounded-md border border-dashed">
                  <p className="text-sm text-accent">No projects added</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="search..." />
        <div className="px-4 py-2 text-base font-medium text-accent">
          Projects selected: {selectedProjects.length}/{MAX_PROJECTS}
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {allProjects.map((project) => (
            <CommandGroup key={project.title}>
              <CommandItem
                key={project.title}
                onSelect={() => handleProjectToggle(project.title)}
                className={`${
                  selectedProjects.includes(project.title)
                    ? "text-foreground bg-accent/5 border border-secondary"
                    : selectedProjects.length >= MAX_PROJECTS
                    ? "bg-background border cursor-not-allowed"
                    : "bg-background border"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={project.title}
                    checked={selectedProjects.includes(project.title)}
                    disabled={
                      !selectedProjects.includes(project.title) &&
                      selectedProjects.length >= MAX_PROJECTS
                    }
                    onCheckedChange={() => handleProjectToggle(project.title)}
                  />
                  <Label
                    htmlFor={project.title}
                    className={`flex items-center gap-2 ${
                      !selectedProjects.includes(project.title) &&
                      selectedProjects.length >= MAX_PROJECTS
                        ? "text-accent/50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <project.icon
                      size={16}
                      className={`${
                        selectedProjects.includes(project.title)
                          ? "text-foreground"
                          : selectedProjects.length >= MAX_PROJECTS
                          ? "text-accent/50"
                          : "text-accent"
                      }`}
                    />
                    {project.title}
                  </Label>
                </div>
              </CommandItem>
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </section>
  );
}

export default AppQuickAccess;
